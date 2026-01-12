import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "home" model, go to https://gelly-fish.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "doG3ubrN1HgY",
  fields: {
    jellyfish: {
      type: "belongsTo",
      parent: { model: "jellyfish" },
      storageKey: "1zCIfdY7nV3k",
      searchIndex: false,
    },
    ocean: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: [
        "Pacific",
        "Atlantic",
        "Indian",
        "Arctic",
        "Antarctic",
      ],
      storageKey: "uS3TU4CeG0bm",
      searchIndex: false,
    },
    reefAddress: {
      type: "string",
      validations: { required: true },
      storageKey: "OEan4_XOfr-E",
      searchIndex: false,
    },
  },
  searchIndex: false,
};
