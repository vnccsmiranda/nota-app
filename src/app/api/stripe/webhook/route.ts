import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

type StripeSubscriptionRaw = Record<string, unknown> & {
  items: { data: Array<{ price: { id: string } }> };
  customer?: string;
};

function getPeriodEnd(sub: StripeSubscriptionRaw): number {
  const periodEnd = (sub as Record<string, unknown>).current_period_end;
  if (typeof periodEnd === "number") return periodEnd * 1000;
  return Date.now() + 30 * 24 * 60 * 60 * 1000;
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.customer || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as unknown as StripeSubscriptionRaw;

        await prisma.user.update({
          where: { stripeCustomerId: session.customer as string },
          data: {
            plan: "PRO",
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(getPeriodEnd(subscription)),
          },
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as unknown as Record<string, unknown>;
        if (!invoice.customer || !invoice.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        ) as unknown as StripeSubscriptionRaw;

        await prisma.user.update({
          where: { stripeCustomerId: invoice.customer as string },
          data: {
            plan: "PRO",
            stripeCurrentPeriodEnd: new Date(getPeriodEnd(subscription)),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        if (!subscription.customer) break;

        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: {
            plan: "FREE",
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
