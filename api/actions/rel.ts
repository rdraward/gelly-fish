// used for jelly - food assignment
export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const jellies = await api.jellyfish.findMany();
  const food = await api.food.findMany({
    filter: {
      category: {
        notEquals: "plant",
      },
    },
  });

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

    // Build array of selected foods for _converge
    const selectedFoods = selectedIndices.map((index) => ({
      update: { id: food[index].id },
    }));

    // Update jellyfish with all selected foods using _converge
    // Since multiple jellyfish can share the same food, we don't track assignments
    const result = await api.jellyfish.update(
      jelly.id,
      {
        foods: selectedFoods,
      },
      {
        select: {
          foods: {
            edges: {
              node: {
                name: true,
              },
            },
          },
        },
      }
    );

    logger.info({
      result,
      jelly: jelly.id,
      jellyName: jelly.name,
    });
  }

  logger.info({ totalJellies: jellies.length, totalFoods: food.length });
};
