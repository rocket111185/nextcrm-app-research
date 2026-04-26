"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";


const logger = createLogger({ module: "actions.crm.opportunity.dashboard.set-inactive" });
export async function setInactiveOpportunity(id: string) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthenticated" };
  }

  logger.debug({ opportunityId: id }, "Setting opportunity inactive");

  if (!id) {
    logger.warn("Opportunity id is required");
  }
  try {
    const opportunity = await prismadb.crm_Opportunities.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        assigned_to: true,
      },
    });

    if (!opportunity) {
      return { error: "Opportunity not found" };
    }

    if (session.user.role !== "admin" && opportunity.assigned_to !== session.user.id) {
      return { error: "Forbidden" };
    }

    const result = await prismadb.crm_Opportunities.update({
      where: {
        id,
      },
      data: {
        status: "INACTIVE",
      },
    });

    logger.debug(
      { opportunityId: result.id, status: result.status },
      "Set inactive update completed"
    );

    logger.info("Opportunity has been set to inactive");
  } catch (error) {
    logger.error({ err: error, opportunityId: id }, "Set opportunity inactive failed");
  }
}
