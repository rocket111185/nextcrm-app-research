"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const logger = createLogger({ module: "actions.projects.update-section-title" });
export const updateSectionTitle = async (data: {
  sectionId: string;
  newTitle: string;
}) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const { sectionId, newTitle } = data;
  if (!sectionId) return { error: "Missing section ID" };

  try {
    await prismadb.sections.update({
      where: { id: sectionId },
      data: { title: newTitle },
    });

    revalidatePath("/[locale]/(routes)/projects", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "UPDATE_SECTION_TITLE");
    return { error: "Failed to update section title" };
  }
};
