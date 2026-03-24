import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateAccessKey(): string {
  const digits = Array.from({ length: 44 }, () => Math.floor(Math.random() * 10));
  return digits.join("");
}

function generateProtocol(): string {
  const timestamp = Date.now().toString();
  return `${timestamp}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
      where: { id },
      include: {
        company: { select: { userId: true } },
        items: true,
      },
    });

    if (!invoice || invoice.company.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (invoice.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Nota deve estar em rascunho para ser emitida" },
        { status: 400 }
      );
    }

    // Mock SEFAZ: simulate 2s delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock: 90% chance of authorization, 10% rejection
    const isAuthorized = Math.random() > 0.1;

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status: isAuthorized ? "AUTHORIZED" : "REJECTED",
        ...(isAuthorized
          ? {
              protocol: generateProtocol(),
              accessKey: generateAccessKey(),
              authorizationDate: new Date(),
              xmlContent: `<NFe><mock>true</mock><number>${invoice.number}</number></NFe>`,
              xmlSigned: `<NFe><mock>true</mock><signed>true</signed></NFe>`,
            }
          : {}),
      },
      include: { items: true, customer: true },
    });

    return NextResponse.json({
      invoice: updated,
      sefazResponse: {
        status: isAuthorized ? "AUTORIZADA" : "REJEITADA",
        protocol: updated.protocol,
        accessKey: updated.accessKey,
        message: isAuthorized
          ? "Nota fiscal autorizada com sucesso"
          : "Rejeição: dados do destinatário inconsistentes (mock)",
      },
    });
  } catch (err) {
    console.error("POST /api/invoices/[id]/emit error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
