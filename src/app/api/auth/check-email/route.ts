import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }

    return NextResponse.json({
      exists: true,
      hasPassword: !!user.password,
    });
  } catch {
    return NextResponse.json({ exists: false }, { status: 400 });
  }
}
