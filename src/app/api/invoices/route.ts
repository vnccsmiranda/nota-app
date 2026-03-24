import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkLimit } from "@/lib/subscription";

const createInvoiceSchema = z.object({
  model: z.enum(["NFE_55", "NFCE_65", "NFSE"]),
  companyId: z.string(),
  customerId: z.string().optional(),
  natOp: z.string().optional(),
  paymentMethod: z.string().optional(),
  infoComplementar: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().optional(),
      quantity: z.number().min(0.01),
      unitPrice: z.number().min(0),
      cfop: z.string().optional(),
      ncm: z.string().optional(),
      cst: z.string().optional(),
    })
  ).min(1),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const status = searchParams.get("status");
    const model = searchParams.get("model");

    if (!companyId) {
      return NextResponse.json({ error: "companyId required" }, { status: 400 });
    }

    const company = await prisma.company.findFirst({
      where: { id: companyId, userId: session.user.id },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        companyId,
        ...(status ? { status: status as "DRAFT" | "PENDING" | "AUTHORIZED" | "REJECTED" | "CANCELLED" | "CONTINGENCY" } : {}),
        ...(model ? { model: model as "NFE_55" | "NFCE_65" | "NFSE" } : {}),
      },
      include: {
        customer: { select: { name: true, cpfCnpj: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (err) {
    console.error("GET /api/invoices error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createInvoiceSchema.parse(body);

    const company = await prisma.company.findFirst({
      where: { id: data.companyId, userId: session.user.id },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const limit = await checkLimit(session.user.id, "invoicesPerMonth", data.companyId);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Limite de notas atingido", current: limit.current, limit: limit.limit },
        { status: 403 }
      );
    }

    // Get next number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { companyId: data.companyId, model: data.model },
      orderBy: { number: "desc" },
    });
    const nextNumber = (lastInvoice?.number ?? 0) + 1;

    // Calculate totals per item
    const itemsWithTotals = data.items.map((item, index) => ({
      sequence: index + 1,
      productId: item.productId || null,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.quantity * item.unitPrice,
      cfop: item.cfop || null,
      ncm: item.ncm || null,
      cst: item.cst || null,
      icmsBase: item.quantity * item.unitPrice,
      icmsRate: 0,
      icmsValue: 0,
      pisBase: item.quantity * item.unitPrice,
      pisRate: 0,
      pisValue: 0,
      cofinsBase: item.quantity * item.unitPrice,
      cofinsRate: 0,
      cofinsValue: 0,
    }));

    const totalValue = itemsWithTotals.reduce((sum, item) => sum + item.totalPrice, 0);

    const invoice = await prisma.invoice.create({
      data: {
        model: data.model,
        number: nextNumber,
        status: "DRAFT",
        companyId: data.companyId,
        customerId: data.customerId || null,
        natOp: data.natOp || "Venda de mercadoria",
        paymentMethod: data.paymentMethod || "01",
        infoComplementar: data.infoComplementar || null,
        totalValue,
        items: {
          create: itemsWithTotals,
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("POST /api/invoices error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
