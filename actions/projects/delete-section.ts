"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const logger = createLogger({ module: "actions.projects.delete-section" });
export const deleteSection = async (sectionId: string) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  if (!sectionId) return { error: "Missing section ID" };

  try {
    await prismadb.tasks.deleteMany({
      where: { section: sectionId },
    });

    await prismadb.sections.delete({
      where: { id: sectionId },
    });

    revalidatePath("/[locale]/(routes)/projects", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "DELETE_SECTION");
    return { error: "Failed to delete section" };
  }
};
