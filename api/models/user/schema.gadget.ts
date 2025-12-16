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
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "nsT_3IF1XDHl",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "MC_QR4WYeUuz",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "N_LtQeLBwMVN",
    },
    firstName: { type: "string", storageKey: "hFbVNPpiAztf" },
    googleImageUrl: { type: "url", storageKey: "XS-sqKxgyWZ1" },
    googleProfileId: { type: "string", storageKey: "5C2ZrXtTHHlH" },
    lastName: { type: "string", storageKey: "QxpLb6NYce0v" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "fYIt_A0-knDz",
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
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "p9GXUrhhED8h",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "AKocSMoxTSi6",
    },
  },
};
