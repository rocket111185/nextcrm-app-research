import { createLogger } from "@/lib/logger";
import axios, { AxiosResponse } from "axios";
import build from "@/buildCount.json";


const logger = createLogger({ module: "actions.github.get-repo-commits" });
export default async function getAllCommits(): Promise<number> {
  const perPage = 100;
  const buildCount = build.build;
  try {
    /* let commitsCount = 0;
    let page = 1;
    let totalCommits: any[] = [];

    while (true) {
      const response: AxiosResponse<any> = await axios.get(
        process.env.NEXT_PUBLIC_GITHUB_REPO_URL + "/commits",
        {
          headers: {
            Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
          params: {
            per_page: perPage,
            page: page,
            sha: process.env.NEXT_PUBLIC_GITHUB_COMMIT_SHA,
          },
        }
      );

      const commitsOnPage = response.data;
      if (commitsOnPage.length === 0) {
        break; // No more commits
      }

      totalCommits = totalCommits.concat(commitsOnPage);
      commitsCount += commitsOnPage.length;
      page++;
    } */

    //console.log(`Total number of commits: ${commitsCount}`);
    //return commitsCount || buildCount;
    return buildCount;
  } catch (error) {
    logger.error({ err: error }, "Error fetching commits");
    return 0;
  }
}
