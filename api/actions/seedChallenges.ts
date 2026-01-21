import { readdir, readFile } from "fs/promises";
import path from "path";

interface ParsedChallenge {
  title: string;
  backstory: string;
  prompt: string;
  solution: string;
  hint: string;
  hintLink: string;
}

/**
 * Parses a gelly file to extract challenge metadata
 */
function parseGellyFile(content: string): ParsedChallenge {
  const lines = content.split("\n");

  let title = "";
  let backstory = "";
  let prompt = "";
  let hint = "";
  let hintLink = "";
  let solution = "";

  let inSolution = false;
  const solutionLines: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("// title:")) {
      title = trimmedLine.replace("// title:", "").trim();
      inSolution = false;
    } else if (trimmedLine.startsWith("// backstory:")) {
      backstory = trimmedLine.replace("// backstory:", "").trim();
      inSolution = false;
    } else if (trimmedLine.startsWith("// prompt:")) {
      prompt = trimmedLine.replace("// prompt:", "").trim();
      inSolution = false;
    } else if (trimmedLine.startsWith("// hint link:")) {
      hintLink = trimmedLine.replace("// hint link:", "").trim();
      inSolution = false;
    } else if (trimmedLine.startsWith("// hint:")) {
      hint = trimmedLine.replace("// hint:", "").trim();
      inSolution = false;
    } else if (trimmedLine.startsWith("// solution:")) {
      inSolution = true;
    } else if (inSolution) {
      // Collect solution lines until we hit another metadata comment
      if (
        trimmedLine.startsWith("// title:") ||
        trimmedLine.startsWith("// backstory:") ||
        trimmedLine.startsWith("// prompt:") ||
        trimmedLine.startsWith("// hint")
      ) {
        inSolution = false;
      } else {
        solutionLines.push(line);
      }
    }
  }

  // Clean up solution - remove empty lines at start/end and trim
  solution = solutionLines
    .join("\n")
    .trim();

  return {
    title,
    backstory,
    prompt,
    solution,
    hint,
    hintLink,
  };
}

export const run: ActionRun = async ({ logger, api }) => {
  const viewsDir = path.join(process.cwd(), "api", "views");

  logger.info(`Reading gelly files from ${viewsDir}`);

  // Read all files in the views directory
  const files = await readdir(viewsDir);
  const gellyFiles = files.filter((file) => file.endsWith(".gelly"));

  logger.info(`Found ${gellyFiles.length} gelly files`);

  const challenges: ParsedChallenge[] = [];

  for (const filename of gellyFiles) {
    const filePath = path.join(viewsDir, filename);
    const content = await readFile(filePath, "utf-8");

    try {
      const challenge = parseGellyFile(content);
      challenges.push(challenge);
      logger.info(`Parsed challenge: ${challenge.title}`);
    } catch (error) {
      logger.error({ error }, `Failed to parse ${filename}`);
    }
  }

  // Bulk create challenge records using internal API
  logger.info(`Creating ${challenges.length} challenge records...`);

  const createdChallenges = await api.internal.challenge.bulkCreate(challenges);

  logger.info(`Successfully created ${createdChallenges.length} challenges`);

  return {
    success: true,
    parsed: challenges.length,
    created: createdChallenges.length,
    challenges: createdChallenges.map((c) => ({ id: c.id, title: c.title })),
  };
};
