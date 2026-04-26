"use server";
import { createLogger } from "@/lib/logger";
import { getSession } from "@/lib/auth-server";
import { prismadb } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const logger = createLogger({ module: "actions.crm.contract-line-items.reorder-line-items" });
export const reorderContractLineItems = async (
  items: { id: string; sort_order: number }[]
) => {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prismadb.$transaction(
      items.map((item) =>
        prismadb.crm_ContractLineItems.update({
          where: { id: item.id },
          data: { sort_order: item.sort_order },
        })
      )
    );

    revalidatePath("/[locale]/(routes)/crm/contracts/[contractId]", "page");
    return { data: { success: true } };
  } catch (error) {
    logger.error({ err: error }, "REORDER_CONTRACT_LINE_ITEMS");
    return { error: "Failed to reorder line items" };
  }
};
