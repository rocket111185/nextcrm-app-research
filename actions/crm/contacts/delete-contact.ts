"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit-log";


const logger = createLogger({ module: "actions.crm.contacts.delete-contact" });
export const deleteContact = async (contactId: string) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  if (!contactId) return { error: "contactId is required" };

  try {
    await prismadb.crm_Contacts.update({
      where: { id: contactId },
      data: { deletedAt: new Date(), deletedBy: session.user.id },
    });
    await writeAuditLog({
      entityType: "contact",
      entityId: contactId,
      action: "deleted",
      changes: null,
      userId: session.user.id,
    });
    revalidatePath("/[locale]/(routes)/crm/contacts", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "DELETE_CONTACT");
    return { error: "Failed to delete contact" };
  }
};
