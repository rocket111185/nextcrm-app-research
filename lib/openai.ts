import OpenAI from "openai";
import { getApiKey } from "./api-keys";
import { createLogger } from "@/lib/logger";

const logger = createLogger({ module: "openai" });

//Check if the openai key is in the database
//If not, use the env variable

export async function openAiHelper(userId: string) {
  const apiKey = await getApiKey("OPENAI", userId);

  if (!apiKey) {
    logger.warn({ provider: "OPENAI", userId }, "API key not configured");
    return null;
  }

  //console.log(apiKey, "apiKey");
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  return openai;
}
