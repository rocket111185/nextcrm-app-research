"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { junctionTableHelpers } from "@/lib/junction-helpers";


const logger = createLogger({ module: "actions.crm.accounts.unwatch-account" });
export const unwatchAccount = async (accountId: string) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  if (!accountId) return { error: "accountId is required" };

  try {
    await prismadb.crm_Accounts.update({
      where: { id: accountId },
      data: {
        watchers: junctionTableHelpers.removeAccountWatcher(
          accountId,
          session.user.id
        ),
      },
    });
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "UNWATCH_ACCOUNT");
    return { error: "Failed to unwatch account" };
  }
};
