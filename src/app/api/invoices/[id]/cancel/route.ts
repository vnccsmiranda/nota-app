import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const cancelSchema = z.object({
  reason: z.string().min(15, "Justificativa deve ter no mínimo 15 caracteres"),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { reason } = cancelSchema.parse(body);

    const invoice = await prisma.invoice.findFirst({
      where: { id },
      include: { company: { select: { userId: true } } },
    });

    if (!invoice || invoice.company.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (invoice.status !== "AUTHORIZED") {
      return NextResponse.json(
        { error: "Somente notas autorizadas podem ser canceladas" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.invoice.update({
        where: { id },
        data: { status: "CANCELLED", cancelDate: new Date() },
      }),
      prisma.invoiceEvent.create({
        data: {
          invoiceId: id,
          type: "CANCEL",
          reason,
          protocol: `CANCEL-${Date.now()}`,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("POST /api/invoices/[id]/cancel error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
