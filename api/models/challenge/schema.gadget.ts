import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "challenge" model, go to https://gelly-fish.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "ExnzjZ3ihz99",
  fields: {
    backstory: {
      type: "string",
      validations: { required: true },
      storageKey: "pdRUBhs1iBDF",
      filterIndex: false,
      searchIndex: false,
    },
    challengeId: {
      type: "number",
      decimals: 0,
      validations: {
        required: true,
        numberRange: { min: 1, max: null },
        unique: true,
      },
      storageKey: "S8Jlgq5fRgVm",
    },
    expectedOutput: {
      type: "string",
      storageKey: "AKsD19zOY5l8",
      filterIndex: false,
      searchIndex: false,
    },
    hint: {
      type: "string",
      validations: { required: true },
      storageKey: "yHLtNXLtXc4O",
      filterIndex: false,
      searchIndex: false,
    },
    hintLink: {
      type: "url",
      validations: { required: true },
      storageKey: "16oNKVjfm1SX",
      filterIndex: false,
      searchIndex: false,
    },
    prompt: {
      type: "string",
      validations: { required: true },
      storageKey: "b2PqPhww44Sy",
      filterIndex: false,
      searchIndex: false,
    },
    solution: {
      type: "string",
      validations: { required: true },
      storageKey: "HmywzBHd9hv_",
      filterIndex: false,
      searchIndex: false,
    },
    title: {
      type: "string",
      validations: { required: true },
      storageKey: "chcuh_Ab_73i",
      filterIndex: false,
      searchIndex: false,
    },
    users: {
      type: "hasManyThrough",
      sibling: { model: "user", relatedField: "challenges" },
      join: {
        model: "progress",
        belongsToSelfField: "challenge",
        belongsToSiblingField: "user",
      },
      storageKey: "3rIZ6JBBaxK_",
    },
  },
};
