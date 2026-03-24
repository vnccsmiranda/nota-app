import Stripe from "stripe";

/**
 * Stripe client with lazy initialization (proxy pattern)
 * Required by CLAUDE.md: "Stripe client com lazy init (proxy pattern)"
 */
function createStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
    typescript: true,
  });
}

// Lazy initialization via proxy
let stripeInstance: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!stripeInstance) {
      stripeInstance = createStripeClient();
    }
    return Reflect.get(stripeInstance, prop);
  },
});

/**
 * Stripe price IDs
 */
export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? "",
} as const;
