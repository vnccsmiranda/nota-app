import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkLimit } from "@/lib/subscription";

const createCompanySchema = z.object({
  cnpj: z.string().min(14).max(14),
  razaoSocial: z.string().min(1),
  nomeFantasia: z.string().optional(),
  ie: z.string().optional(),
  im: z.string().optional(),
  crt: z.enum(["SIMPLES_NACIONAL", "LUCRO_PRESUMIDO", "LUCRO_REAL"]),
  endereco: z.object({
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    cep: z.string().optional(),
    codigoMunicipio: z.string().optional(),
  }).optional(),
  uf: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companies = await prisma.company.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(companies);
  } catch (err) {
    console.error("GET /api/companies error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check plan limit
    const limit = await checkLimit(session.user.id, "companies");
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Limite atingido",
          current: limit.current,
          limit: limit.limit,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = createCompanySchema.parse(body);

    // Validate CNPJ uniqueness
    const existing = await prisma.company.findUnique({
      where: { cnpj: data.cnpj },
    });
    if (existing) {
      return NextResponse.json(
        { error: "CNPJ já cadastrado" },
        { status: 409 }
      );
    }

    const company = await prisma.company.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("POST /api/companies error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
