"use server";
import { getSession } from "@/lib/auth-server";

import { prismadb } from "@/lib/prisma";
import Papa from "papaparse";

function normalizeCellValue(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

function parseEmployeesValue(value?: string) {
  const parsed = JSON.parse(normalizeCellValue(value) || "null") as {
    min: number;
    max: number;
  };

  return `${parsed.min.toString()}-${parsed.max.toString()}`;
}

export async function importTargets(
  formData: FormData
): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  const mappingRaw = formData.get("mapping") as string | null;
  const mapping: Record<string, string> = mappingRaw ? JSON.parse(mappingRaw) : {};

  const text = await file.text();
  const { data } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const valid: any[] = [];
  const errors: string[] = [];

  data.forEach((rawRow, index) => {
    const row: Record<string, string> = {};
    if (Object.keys(mapping).length > 0) {
      Object.entries(mapping).forEach(([csvCol, targetField]) => {
        if (targetField && rawRow[csvCol] !== undefined) {
          row[targetField] = rawRow[csvCol];
        }
      });
    } else {
      Object.assign(row, rawRow);
    }

    const last_name = normalizeCellValue(row.last_name);
    const email = normalizeCellValue(row.email).toLowerCase();
    const mobile_phone = normalizeCellValue(row.mobile_phone);
    const company = normalizeCellValue(row.company);
    const company_website = normalizeCellValue(row.company_website);
    const companyDomain = company_website || company.toLowerCase() || null;
    const employees = parseEmployeesValue(row.employees);

    if (!last_name && !company) {
      errors.push(`Row ${index + 2}: missing last_name or company`);
      return;
    }

    valid.push({
      last_name: last_name ?? "",
      first_name: row.first_name || null,
      email: email || null,
      mobile_phone: mobile_phone || null,
      office_phone: row.office_phone || null,
      company: row.company || null,
      position: row.position || null,
      company_website: companyDomain || null,
      personal_website: row.personal_website || null,
      social_linkedin: row.social_linkedin || null,
      social_x: row.social_x || null,
      social_instagram: row.social_instagram || null,
      social_facebook: row.social_facebook || null,
      personal_email: row.personal_email || null,
      company_email: row.company_email || null,
      company_phone: row.company_phone || null,
      city: row.city || null,
      country: row.country || null,
      industry: row.industry || null,
      employees: employees || null,
      description: row.description || null,
      created_by: (session.user as any).id,
    });
  });

  if (valid.length > 0) {
    await prismadb.crm_Targets.createMany({ data: valid, skipDuplicates: true });
  }

  return { imported: valid.length, skipped: errors.length, errors };
}
