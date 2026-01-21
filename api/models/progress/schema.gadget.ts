import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "progress" model, go to https://gelly-fish.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "66NPqDdN4iNI",
  fields: {
    challenge: {
      type: "belongsTo",
      parent: { model: "challenge" },
      storageKey: "W7LdpRHzMosv",
      searchIndex: false,
    },
    isComplete: {
      type: "boolean",
      default: false,
      validations: { required: true },
      storageKey: "SElQhOKYzZin",
      searchIndex: false,
    },
    solution: {
      type: "string",
      validations: { required: true },
      storageKey: "TomQWiM6j2pm",
      searchIndex: false,
    },
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "66NPqDdN4iNI-BelongsTo-User",
      searchIndex: false,
    },
  },
  searchIndex: false,
};
