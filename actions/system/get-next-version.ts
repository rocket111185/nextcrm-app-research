import { createLogger } from "@/lib/logger";
import fs from "fs";

const logger = createLogger({ module: "actions.system.get-next-version" });
export default async function getNextVersion() {
  try {
    // Read the package.json file synchronously
    const data = fs.readFileSync("package.json", "utf8");

    try {
      const packageJson = JSON.parse(data);
      const version = packageJson.dependencies["next"]; // Replace 'dependencies' with 'devDependencies' if Next.js is a dev dependency

      //console.log("Actual Next.js version:", version);
      return version;
    } catch (error) {
      logger.error({ err: error }, "Error parsing package.json");
      return "0";
    }
  } catch (error) {
    logger.error({ err: error }, "Error reading package.json");
  }
}
