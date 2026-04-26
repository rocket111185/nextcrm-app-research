import { createLogger } from "@/lib/logger";
import { markTaskDone } from "@/actions/projects/mark-task-done";

const logger = createLogger({ module: "app.routes.projects.actions.get-task-done" });

//Actions - wrapper kept for backwards compatibility
export const getTaskDone = async (taskId: string) => {
  try {
    await markTaskDone(taskId);
  } catch (error) {
    logger.error({ err: error, taskId }, "Mark task done wrapper failed");
  }
};
