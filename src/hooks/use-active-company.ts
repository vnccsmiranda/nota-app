"use client";

import { useState, useEffect, useCallback } from "react";

const ACTIVE_COMPANY_KEY = "nota-active-company";

export function useActiveCompany() {
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Read from cookie on mount
    const cookies = document.cookie.split(";");
    const companyCookie = cookies.find((c) =>
      c.trim().startsWith(`${ACTIVE_COMPANY_KEY}=`)
    );
    if (companyCookie) {
      setActiveCompanyId(companyCookie.split("=")[1]?.trim() ?? null);
    }
  }, []);

  const setCompany = useCallback((companyId: string) => {
    setActiveCompanyId(companyId);
    document.cookie = `${ACTIVE_COMPANY_KEY}=${companyId};path=/;max-age=${60 * 60 * 24 * 365}`;
  }, []);

  return { activeCompanyId, setCompany };
}
