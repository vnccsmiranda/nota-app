import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateProductSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  ncm: z.string().optional(),
  cfop: z.string().optional(),
  cst: z.string().optional(),
  unit: z.string().optional(),
  price: z.number().min(0).optional(),
  gtin: z.string().optional(),
  type: z.enum(["PRODUCT", "SERVICE"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.product.findFirst({
      where: { id },
      include: { company: { select: { userId: true } } },
    });
    if (!existing || existing.company.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = updateProductSchema.parse(body);

    const product = await prisma.product.update({ where: { id }, data });

    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error("PATCH /api/products/[id] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.product.findFirst({
      where: { id },
      include: { company: { select: { userId: true } } },
    });
    if (!existing || existing.company.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
