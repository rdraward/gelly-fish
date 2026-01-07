import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://gelly-wiggle.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v2",
  storageKey: "DataModel-AppAuth-User",
  fields: {
    challenges: {
      type: "hasManyThrough",
      sibling: { model: "challenge", relatedField: "users" },
      join: {
        model: "progress",
        belongsToSelfField: "user",
        belongsToSiblingField: "challenge",
      },
      storageKey: "RIbRl3sQSKka",
    },
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "-BFIJ7qLd6AM",
      searchIndex: false,
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "nsT_3IF1XDHl",
      searchIndex: false,
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "MC_QR4WYeUuz",
      filterIndex: false,
      searchIndex: false,
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "N_LtQeLBwMVN",
      searchIndex: false,
    },
    firstName: {
      type: "string",
      storageKey: "hFbVNPpiAztf",
      filterIndex: false,
      searchIndex: false,
    },
    googleImageUrl: {
      type: "url",
      storageKey: "XS-sqKxgyWZ1",
      filterIndex: false,
      searchIndex: false,
    },
    googleProfileId: {
      type: "string",
      storageKey: "5C2ZrXtTHHlH",
      filterIndex: false,
      searchIndex: false,
    },
    lastName: {
      type: "string",
      storageKey: "QxpLb6NYce0v",
      filterIndex: false,
      searchIndex: false,
    },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "fYIt_A0-knDz",
      filterIndex: false,
      searchIndex: false,
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "60Hy2Ck89-O4",
    },
    profilePicture: {
      type: "file",
      allowPublicAccess: true,
      storageKey: "DZbqTe4mo4b_",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "3KzDZ3x4NtNV",
      searchIndex: false,
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "p9GXUrhhED8h",
      filterIndex: false,
      searchIndex: false,
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "AKocSMoxTSi6",
      searchIndex: false,
    },
  },
  searchIndex: false,
};
