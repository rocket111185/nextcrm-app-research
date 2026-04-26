"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const logger = createLogger({ module: "actions.crm.contacts.unlink-opportunity" });
export const unlinkOpportunity = async (data: {
  contactId: string;
  opportunityId: string;
}) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const { contactId, opportunityId } = data;

  if (!contactId) return { error: "contactId is required" };
  if (!opportunityId) return { error: "opportunityId is required" };

  try {
    await prismadb.contactsToOpportunities.delete({
      where: {
        contact_id_opportunity_id: {
          contact_id: contactId,
          opportunity_id: opportunityId,
        },
      },
    });
    revalidatePath("/[locale]/(routes)/crm/contacts", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "UNLINK_OPPORTUNITY");
    return { error: "Failed to unlink opportunity" };
  }
};
