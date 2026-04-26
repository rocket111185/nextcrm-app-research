"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const logger = createLogger({ module: "actions.projects.assign-document-to-task" });
export const assignDocumentToTask = async (data: {
  documentId: string;
  taskId: string;
}) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const { documentId, taskId } = data;
  if (!documentId) return { error: "Missing document ID" };
  if (!taskId) return { error: "Missing task ID" };

  try {
    const task = await prismadb.tasks.findUnique({
      where: { id: taskId },
    });

    if (!task) return { error: "Task not found" };

    await prismadb.documentsToTasks.create({
      data: {
        document_id: documentId,
        task_id: taskId,
      },
    });

    await prismadb.tasks.update({
      where: { id: taskId },
      data: { updatedBy: session.user.id },
    });

    revalidatePath("/[locale]/(routes)/projects", "page");
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "ASSIGN_DOCUMENT_TO_TASK");
    return { error: "Failed to assign document to task" };
  }
};

export const disconnectDocumentFromTask = async (data: {
  documentId: string;
  taskId: string;
}) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const { documentId, taskId } = data;
  if (!documentId) return { error: "Missing document ID" };
  if (!taskId) return { error: "Missing task ID" };

  try {
    const task = await prismadb.tasks.findUnique({
      where: { id: taskId },
    });

    if (!task) return { error: "Task not found" };

    await prismadb.documentsToTasks.delete({
      where: {
        document_id_task_id: {
          document_id: documentId,
          task_id: taskId,
        },
      },
    });

    const updatedTask = await prismadb.tasks.update({
      where: { id: taskId },
      data: { updatedBy: session.user.id },
    });

    revalidatePath("/[locale]/(routes)/projects", "page");
    return { data: updatedTask };
  } catch (error) {
    logger.error({ err: error }, "DISCONNECT_DOCUMENT_FROM_TASK");
    return { error: "Failed to disconnect document from task" };
  }
};
