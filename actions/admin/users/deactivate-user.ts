"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const logger = createLogger({ module: "actions.admin.users.deactivate-user" });
export const deactivateUser = async (userId: string) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  if (!userId) return { error: "userId is required" };

  try {
    const user = await prismadb.users.update({
      where: { id: userId },
      data: { userStatus: "INACTIVE" },
    });
    revalidatePath("/[locale]/(routes)/admin", "page");
    return { data: user };
  } catch (error) {
    logger.error({ err: error }, "DEACTIVATE_USER");
    return { error: "Failed to deactivate user" };
  }
};
