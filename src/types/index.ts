export type Plan = "FREE" | "PRO";

export type BillingCycle = "MONTHLY" | "YEARLY";

export type InvoiceModel = "NFE_55" | "NFCE_65" | "NFSE";

export type InvoiceStatus =
  | "DRAFT"
  | "PENDING"
  | "AUTHORIZED"
  | "REJECTED"
  | "CANCELLED"
  | "CONTINGENCY";

export type TaxRegime =
  | "SIMPLES_NACIONAL"
  | "LUCRO_PRESUMIDO"
  | "LUCRO_REAL";

export type ProductType = "PRODUCT" | "SERVICE";

export type EventType =
  | "CANCEL"
  | "CORRECTION"
  | "MANIFESTATION"
  | "INUTILIZATION";

export interface PlanLimits {
  invoicesPerMonth: number;
  companies: number;
  products: number;
  customers: number;
  reports: boolean;
  support: "community" | "priority";
}

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
