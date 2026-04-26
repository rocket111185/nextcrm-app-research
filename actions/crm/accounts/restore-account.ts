"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit-log";


const logger = createLogger({ module: "actions.crm.accounts.restore-account" });
export const restoreAccount = async (accountId: string) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };
  if (session.user.role !== "admin") return { error: "Forbidden" };
  if (!accountId) return { error: "accountId is required" };

  try {
    await prismadb.crm_Accounts.update({
      where: { id: accountId },
      data: { deletedAt: null, deletedBy: null },
    });
    await writeAuditLog({
      entityType: "account",
      entityId: accountId,
      action: "restored",
      changes: null,
      userId: session.user.id,
    });
    revalidatePath("/[locale]/(routes)/crm/accounts", "page");
    revalidatePath("/[locale]/(routes)/admin/audit-log", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "RESTORE_ACCOUNT");
    return { error: "Failed to restore account" };
  }
};
