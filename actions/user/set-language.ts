"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Language } from "@prisma/client";


const logger = createLogger({ module: "actions.user.set-language" });
export const setLanguage = async (data: {
  userId: string;
  language: string;
}) => {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const { userId, language } = data;

  if (!userId) return { error: "userId is required" };
  if (!language) return { error: "language is required" };

  // Ensure user can only update their own language unless admin
  if (session.user.id !== userId && session.user.role !== "admin") {
    return { error: "Forbidden" };
  }

  try {
    await prismadb.users.update({
      data: { userLanguage: language as Language },
      where: { id: userId },
    });
    revalidatePath("/[locale]/(routes)/profile", "page");
    return { language };
  } catch (error) {
    logger.error({ err: error }, "SET_LANGUAGE");
    return { error: "Failed to set language" };
  }
};
