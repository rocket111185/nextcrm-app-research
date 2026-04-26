"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const logger = createLogger({ module: "actions.projects.mark-task-done" });
export const markTaskDone = async (taskId: string) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  if (!taskId) return { error: "Missing task ID" };

  try {
    await prismadb.tasks.update({
      where: { id: taskId },
      data: {
        taskStatus: "COMPLETE",
        updatedBy: session.user.id,
      },
    });

    revalidatePath("/[locale]/(routes)/projects", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "MARK_TASK_DONE");
    return { error: "Failed to mark task as done" };
  }
};
