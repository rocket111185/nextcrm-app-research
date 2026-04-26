"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const logger = createLogger({ module: "actions.crm.tasks.delete-task" });
export const deleteTask = async (taskId: string) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  if (!taskId) return { error: "taskId is required" };

  try {
    await prismadb.tasksComments.deleteMany({
      where: { task: taskId },
    });

    await prismadb.crm_Accounts_Tasks.delete({
      where: { id: taskId },
    });

    revalidatePath("/[locale]/(routes)/crm", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "DELETE_TASK");
    return { error: "Failed to delete task" };
  }
};
