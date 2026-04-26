"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit-log";


const logger = createLogger({ module: "actions.crm.accounts.delete-account" });
export const deleteAccount = async (accountId: string) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };
  if (!accountId) return { error: "accountId is required" };

  try {
    await prismadb.crm_Accounts.update({
      where: { id: accountId },
      data: { deletedAt: new Date(), deletedBy: session.user.id },
    });
    await writeAuditLog({
      entityType: "account",
      entityId: accountId,
      action: "deleted",
      changes: null,
      userId: session.user.id,
    });
    revalidatePath("/[locale]/(routes)/crm/accounts", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "DELETE_ACCOUNT");
    return { error: "Failed to delete account" };
  }
};
