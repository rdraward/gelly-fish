import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "food" model, go to https://gelly-wiggle.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "ISkisyx7g_ed",
  fields: {
    category: {
      type: "enum",
      acceptMultipleSelections: false,
      acceptUnlistedOptions: false,
      options: ["plant", "meat", "other"],
      validations: { required: true },
      storageKey: "0ulsfqmnzMhA",
      searchIndex: false,
    },
    jellyfish: {
      type: "hasManyThrough",
      sibling: { model: "jellyfish", relatedField: "foods" },
      join: {
        model: "foodChain",
        belongsToSelfField: "food",
        belongsToSiblingField: "jellyfish",
      },
      storageKey: "VSeBPAbmIys-",
    },
    name: {
      type: "string",
      validations: { required: true },
      storageKey: "XukAieOen-aY",
      filterIndex: false,
      searchIndex: false,
    },
  },
  searchIndex: false,
};
