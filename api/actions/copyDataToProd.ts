import type { FoodCategoryEnum, HomeOceanEnum } from "@gadget-client/gelly-fish";

export const run: ActionRun = async ({ logger, api }) => {
  // Development environment API URL - update this with your actual dev environment URL
  const DEV_API_URL = "https://gelly-fish--development.gadget.app/api/graphql";

  // Helper to fetch all records from dev environment
  async function fetchFromDev<T>(query: string, modelName: string): Promise<T[]> {
    const response = await fetch(DEV_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // No auth needed if the models have public read access, otherwise add auth header
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(`Failed to fetch ${modelName}: ${JSON.stringify(result.errors)}`);
    }
    return result.data[modelName].edges.map((edge: { node: T }) => edge.node);
  }

  // ID mapping: dev ID -> prod ID
  const idMaps = {
    challenge: new Map<string, string>(),
    food: new Map<string, string>(),
    jellyfish: new Map<string, string>(),
    home: new Map<string, string>(),
    foodChain: new Map<string, string>(),
  };

  logger.info("Starting data copy from development to production...");

  // Step 1: Fetch all data from development
  logger.info("Fetching data from development environment...");

  const [challenges, foods, jellyfish, homes, foodChains] = await Promise.all([
    fetchFromDev<{
      id: string;
      backstory: string;
      challengeId: number;
      hint: string;
      hintLink: string;
      prompt: string;
      solution: string;
      title: string;
      viewName: string;
    }>(
      `query { challenges { edges { node { id backstory challengeId hint hintLink prompt solution title viewName } } } }`,
      "challenges"
    ),
    fetchFromDev<{
      id: string;
      name: string;
      category: string;
    }>(
      `query { foods { edges { node { id name category } } } }`,
      "foods"
    ),
    fetchFromDev<{
      id: string;
      name: string;
      type: string;
      age: number;
      length: number;
      weight: number;
    }>(
      `query { jellyfishes { edges { node { id name type age length weight } } } }`,
      "jellyfishes"
    ),
    fetchFromDev<{
      id: string;
      reefAddress: string;
      ocean: string | null;
      jellyfish: { id: string } | null;
    }>(
      `query { homes { edges { node { id reefAddress ocean jellyfish { id } } } } }`,
      "homes"
    ),
    fetchFromDev<{
      id: string;
      food: { id: string } | null;
      jellyfish: { id: string } | null;
    }>(
      `query { foodChains { edges { node { id food { id } jellyfish { id } } } } }`,
      "foodChains"
    ),
  ]);

  logger.info({
    counts: {
      challenges: challenges.length,
      foods: foods.length,
      jellyfish: jellyfish.length,
      homes: homes.length,
      foodChains: foodChains.length,
    },
  }, "Fetched data from development");

  // Step 2: Create challenges in production
  logger.info("Creating challenges in production...");
  for (const challenge of challenges) {
    const created = await api.challenge.create({
      backstory: challenge.backstory,
      challengeId: challenge.challengeId,
      hint: challenge.hint,
      hintLink: challenge.hintLink,
      prompt: challenge.prompt,
      solution: challenge.solution,
      title: challenge.title,
      viewName: challenge.viewName,
    });
    idMaps.challenge.set(challenge.id, created.id);
  }
  logger.info(`Created ${challenges.length} challenges`);

  // Step 3: Create foods in production
  logger.info("Creating foods in production...");
  for (const food of foods) {
    const created = await api.food.create({
      name: food.name,
      category: food.category as FoodCategoryEnum,
    });
    idMaps.food.set(food.id, created.id);
  }
  logger.info(`Created ${foods.length} foods`);

  // Step 4: Create jellyfish in production
  logger.info("Creating jellyfish in production...");
  for (const jelly of jellyfish) {
    const created = await api.jellyfish.create({
      name: jelly.name,
      type: jelly.type,
      age: jelly.age,
      length: jelly.length,
      weight: jelly.weight,
    });
    idMaps.jellyfish.set(jelly.id, created.id);
  }
  logger.info(`Created ${jellyfish.length} jellyfish`);

  // Step 5: Create homes in production (with jellyfish relationship)
  logger.info("Creating homes in production...");
  for (const home of homes) {
    const jellyfishId = home.jellyfish?.id ? idMaps.jellyfish.get(home.jellyfish.id) : undefined;

    const created = await api.home.create({
      reefAddress: home.reefAddress,
      ocean: (home.ocean as HomeOceanEnum) ?? undefined,
      jellyfish: jellyfishId ? { _link: jellyfishId } : undefined,
    });
    idMaps.home.set(home.id, created.id);
  }
  logger.info(`Created ${homes.length} homes`);

  // Step 6: Create foodChains in production (with food and jellyfish relationships)
  logger.info("Creating foodChains in production...");
  for (const foodChain of foodChains) {
    const foodId = foodChain.food?.id ? idMaps.food.get(foodChain.food.id) : undefined;
    const jellyfishId = foodChain.jellyfish?.id ? idMaps.jellyfish.get(foodChain.jellyfish.id) : undefined;

    const created = await api.foodChain.create({
      food: foodId ? { _link: foodId } : undefined,
      jellyfish: jellyfishId ? { _link: jellyfishId } : undefined,
    });
    idMaps.foodChain.set(foodChain.id, created.id);
  }
  logger.info(`Created ${foodChains.length} foodChains`);

  logger.info("Data copy complete!");

  return {
    success: true,
    counts: {
      challenges: challenges.length,
      foods: foods.length,
      jellyfish: jellyfish.length,
      homes: homes.length,
      foodChains: foodChains.length,
    },
    idMaps: {
      challenge: Object.fromEntries(idMaps.challenge),
      food: Object.fromEntries(idMaps.food),
      jellyfish: Object.fromEntries(idMaps.jellyfish),
      home: Object.fromEntries(idMaps.home),
      foodChain: Object.fromEntries(idMaps.foodChain),
    },
  };
};
