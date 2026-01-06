import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "jellyfish" model, go to https://gelly-wiggle.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "nGEE4pCNH9nQ",
  fields: {
    age: {
      type: "number",
      decimals: 0,
      validations: { required: true },
      storageKey: "cIzG20rsUBTa",
      searchIndex: false,
    },
    foods: {
      type: "hasManyThrough",
      sibling: { model: "food", relatedField: "jellyfish" },
      join: {
        model: "foodChain",
        belongsToSelfField: "jellyfish",
        belongsToSiblingField: "food",
      },
      storageKey: "VLaRTmp-wR7c",
    },
    homes: {
      type: "hasMany",
      children: { model: "home", belongsToField: "jellyfish" },
      storageKey: "06tBY7M9FO6g",
    },
    length: {
      type: "number",
      validations: { required: true },
      storageKey: "70LvTMGQc0bc",
      searchIndex: false,
    },
    name: {
      type: "string",
      validations: {
        required: true,
        stringLength: { min: null, max: 80 },
      },
      storageKey: "H57Y5fh4_QXM",
      filterIndex: false,
      searchIndex: false,
    },
    type: {
      type: "string",
      validations: {
        required: true,
        stringLength: { min: null, max: 80 },
      },
      storageKey: "KgGJiW-k0d4Q",
      searchIndex: false,
    },
    weight: {
      type: "number",
      validations: { required: true },
      storageKey: "wBFQ873owyvR",
      searchIndex: false,
    },
  },
  searchIndex: false,
};
