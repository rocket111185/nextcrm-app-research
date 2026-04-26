"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit-log";


const logger = createLogger({ module: "actions.crm.opportunities.delete-opportunity" });
export const deleteOpportunity = async (opportunityId: string) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  if (!opportunityId) return { error: "opportunityId is required" };

  try {
    await prismadb.crm_Opportunities.update({
      where: { id: opportunityId },
      data: { deletedAt: new Date(), deletedBy: session.user.id },
    });
    await writeAuditLog({
      entityType: "opportunity",
      entityId: opportunityId,
      action: "deleted",
      changes: null,
      userId: session.user.id,
    });
    revalidatePath("/[locale]/(routes)/crm/opportunities", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "DELETE_OPPORTUNITY");
    return { error: "Failed to delete opportunity" };
  }
};
