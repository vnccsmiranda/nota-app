import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkLimit } from "@/lib/subscription";

const createCustomerSchema = z.object({
  cpfCnpj: z.string().min(11).max(14),
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  isCompany: z.boolean().default(false),
  ie: z.string().optional(),
  address: z.object({
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    cep: z.string().optional(),
  }).optional(),
  companyId: z.string(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const search = searchParams.get("search");

    if (!companyId) {
      return NextResponse.json({ error: "companyId required" }, { status: 400 });
    }

    // Verify company ownership
    const company = await prisma.company.findFirst({
      where: { id: companyId, userId: session.user.id },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const customers = await prisma.customer.findMany({
      where: {
        companyId,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { cpfCnpj: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(customers);
  } catch (err) {
    console.error("GET /api/customers error:", err);
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
    const data = createCustomerSchema.parse(body);

    // Verify company ownership
    const company = await prisma.company.findFirst({
      where: { id: data.companyId, userId: session.user.id },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Check plan limit
    const limit = await checkLimit(session.user.id, "customers", data.companyId);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Limite atingido", current: limit.current, limit: limit.limit },
        { status: 403 }
      );
    }

    const customer = await prisma.customer.create({ data });

    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("POST /api/customers error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
