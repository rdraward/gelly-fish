import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "foodChain" model, go to https://gelly-wiggle.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "XGGwQX2tNU3x",
  fields: {
    food: {
      type: "belongsTo",
      parent: { model: "food" },
      storageKey: "WWYaW4YTLNP_",
      searchIndex: false,
    },
    jellyfish: {
      type: "belongsTo",
      parent: { model: "jellyfish" },
      storageKey: "p4IFZSrOR9-Q",
      searchIndex: false,
    },
  },
  searchIndex: false,
};
