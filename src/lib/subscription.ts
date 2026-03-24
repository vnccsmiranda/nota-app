import { prisma } from "@/lib/prisma";
import type { Plan, PlanLimits } from "@/types";

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  FREE: {
    invoicesPerMonth: 1,
    companies: 1,
    products: 10,
    customers: 10,
    reports: false,
    support: "community",
  },
  PRO: {
    invoicesPerMonth: Infinity,
    companies: Infinity,
    products: Infinity,
    customers: Infinity,
    reports: true,
    support: "priority",
  },
} as const;

export async function getUserPlan(userId: string): Promise<{
  plan: Plan;
  limits: PlanLimits;
  isActive: boolean;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, stripeCurrentPeriodEnd: true },
  });

  if (!user) {
    return { plan: "FREE", limits: PLAN_LIMITS.FREE, isActive: true };
  }

  const plan = user.plan as Plan;
  const isActive =
    plan === "FREE" ||
    (user.stripeCurrentPeriodEnd
      ? user.stripeCurrentPeriodEnd > new Date()
      : false);

  return {
    plan: isActive ? plan : "FREE",
    limits: isActive ? PLAN_LIMITS[plan] : PLAN_LIMITS.FREE,
    isActive,
  };
}

export async function getUsage(userId: string, companyId?: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [companies, invoicesThisMonth, products, customers] =
    await Promise.all([
      prisma.company.count({ where: { userId } }),
      prisma.invoice.count({
        where: {
          company: { userId },
          ...(companyId ? { companyId } : {}),
          createdAt: { gte: startOfMonth },
          status: { not: "DRAFT" },
        },
      }),
      prisma.product.count({
        where: {
          company: { userId },
          ...(companyId ? { companyId } : {}),
        },
      }),
      prisma.customer.count({
        where: {
          company: { userId },
          ...(companyId ? { companyId } : {}),
        },
      }),
    ]);

  return {
    companies,
    invoicesThisMonth,
    products,
    customers,
  };
}

export async function checkLimit(
  userId: string,
  resource: keyof PlanLimits,
  companyId?: string
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const { limits } = await getUserPlan(userId);
  const usage = await getUsage(userId, companyId);

  const limitValue = limits[resource];
  if (typeof limitValue === "boolean") {
    return {
      allowed: limitValue,
      current: 0,
      limit: limitValue ? 1 : 0,
    };
  }

  const resourceMap: Record<string, number> = {
    invoicesPerMonth: usage.invoicesThisMonth,
    companies: usage.companies,
    products: usage.products,
    customers: usage.customers,
  };

  const current = resourceMap[resource] ?? 0;

  return {
    allowed: current < (limitValue as number),
    current,
    limit: limitValue as number,
  };
}
