import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkLimit } from "@/lib/subscription";

const createProductSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  ncm: z.string().optional(),
  cfop: z.string().optional(),
  cst: z.string().optional(),
  unit: z.string().default("UN"),
  price: z.number().min(0),
  gtin: z.string().optional(),
  type: z.enum(["PRODUCT", "SERVICE"]).default("PRODUCT"),
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
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    if (!companyId) {
      return NextResponse.json({ error: "companyId required" }, { status: 400 });
    }

    const company = await prisma.company.findFirst({
      where: { id: companyId, userId: session.user.id },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: {
        companyId,
        ...(type ? { type: type as "PRODUCT" | "SERVICE" } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { code: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("GET /api/products error:", err);
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
    const data = createProductSchema.parse(body);

    const company = await prisma.company.findFirst({
      where: { id: data.companyId, userId: session.user.id },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const limit = await checkLimit(session.user.id, "products", data.companyId);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Limite atingido", current: limit.current, limit: limit.limit },
        { status: 403 }
      );
    }

    const product = await prisma.product.create({ data });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
