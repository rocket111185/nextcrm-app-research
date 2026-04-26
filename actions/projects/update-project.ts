"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const logger = createLogger({ module: "actions.projects.update-project" });
export const updateProject = async (data: {
  id: string;
  title: string;
  description: string;
  visibility: string;
}) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const { id, title, description, visibility } = data;
  if (!title) return { error: "Missing project name" };
  if (!description) return { error: "Missing project description" };

  try {
    await prismadb.boards.update({
      where: { id },
      data: {
        title,
        description,
        visibility,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/[locale]/(routes)/projects", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "UPDATE_PROJECT");
    return { error: "Failed to update project" };
  }
};
