import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "challenge" model, go to https://gelly-wiggle.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "ExnzjZ3ihz99",
  fields: {
    backstory: {
      type: "string",
      validations: { required: true },
      storageKey: "pdRUBhs1iBDF",
    },
    expectedOutput: {
      type: "string",
      validations: { required: true },
      storageKey: "AKsD19zOY5l8",
    },
    hint: {
      type: "string",
      validations: { required: true },
      storageKey: "yHLtNXLtXc4O",
    },
    hintLink: {
      type: "url",
      validations: { required: true },
      storageKey: "16oNKVjfm1SX",
    },
    prompt: {
      type: "string",
      validations: { required: true },
      storageKey: "b2PqPhww44Sy",
    },
    solution: {
      type: "string",
      validations: { required: true },
      storageKey: "HmywzBHd9hv_",
    },
    title: {
      type: "string",
      validations: { required: true },
      storageKey: "chcuh_Ab_73i",
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
