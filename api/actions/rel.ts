// used for jellyfish - food assignment (via foodChain) and jellyfish - home assignment
export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const jellies = await api.jellyfish.findMany();
  const food = await api.food.findMany({
    filter: {
      category: {
        notEquals: "plant",
      },
    },
  });
  const homes = await api.home.findMany();

  logger.info({
    totalJellies: jellies.length,
    totalFoods: food.length,
    totalHomes: homes.length,
  });

  // Part 1: Create foodChain records to link jellyfish and food (many-to-many)
  for (let jelly of jellies) {
    // Skip if no foods are available
    if (food.length === 0) {
      logger.warn({
        jelly: jelly.id,
        jellyName: jelly.name,
        message: "No foods available to assign",
      });
      continue;
    }

    // Pick a random whole number X between 1 and 3 (inclusive)
    const X = Math.floor(Math.random() * 3) + 1;

    // Create a pool of indices from all foods (allows same food for multiple jellyfish)
    const pool = Array.from({ length: food.length }, (_, i) => i);

    // Shuffle the pool (Fisher–Yates shuffle)
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Take the first X indices (guaranteed unique)
    // Ensure at least 1 food is selected (minimum of 1, or X if food.length >= X)
    const numToSelect = Math.max(1, Math.min(X, food.length));
    const selectedIndices = pool.slice(0, numToSelect);

    // Create foodChain records for each selected food
    const createdFoodChains = [];
    for (const index of selectedIndices) {
      const selectedFood = food[index];
      const foodChain = await api.foodChain.create({
        jellyfish: { _link: jelly.id },
        food: { _link: selectedFood.id },
      });
      createdFoodChains.push(foodChain);
    }

    logger.info({
      jelly: jelly.id,
      jellyName: jelly.name,
      assignedFoods: selectedIndices.map((i) => food[i].name),
      foodChainsCreated: createdFoodChains.length,
    });
  }

  // Part 2: Distribute homes among jellyfish
  // Each jellyfish gets at least 1 home, some get more than 2
  if (homes.length === 0) {
    logger.warn("No homes available to assign");
  } else if (homes.length < jellies.length) {
    logger.warn({
      message: "Not enough homes for all jellyfish",
      homes: homes.length,
      jellyfish: jellies.length,
    });
  } else {
    // Create a pool of home indices
    const homePool = Array.from({ length: homes.length }, (_, i) => i);

    // Shuffle the home pool
    for (let i = homePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [homePool[i], homePool[j]] = [homePool[j], homePool[i]];
    }

    // First, assign 1 home to each jellyfish (guarantees minimum)
    let homeIndex = 0;
    for (let i = 0; i < jellies.length && homeIndex < homes.length; i++) {
      const jelly = jellies[i];
      const home = homes[homePool[homeIndex]];
      await api.home.update(home.id, {
        jellyfish: { _link: jelly.id },
      });
      homeIndex++;
    }

    // Then, randomly distribute remaining homes
    // Some jellyfish will get more than 2 homes total
    const remainingHomes = homes.length - jellies.length;
    for (let i = 0; i < remainingHomes && homeIndex < homes.length; i++) {
      // Pick a random jellyfish to assign the home to
      const randomJellyIndex = Math.floor(Math.random() * jellies.length);
      const jelly = jellies[randomJellyIndex];
      const home = homes[homePool[homeIndex]];
      await api.home.update(home.id, {
        jellyfish: { _link: jelly.id },
      });
      homeIndex++;
    }

    logger.info({
      message: "Homes distributed",
      totalHomes: homes.length,
      totalJellyfish: jellies.length,
      homesPerJellyfish: Math.floor(homes.length / jellies.length),
      remainingHomes: homes.length % jellies.length,
    });
  }

  logger.info({
    totalJellies: jellies.length,
    totalFoods: food.length,
    totalHomes: homes.length,
  });
};
