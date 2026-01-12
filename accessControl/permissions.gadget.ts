import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://gelly-fish.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "signed-in": {
      storageKey: "signed-in",
      models: {
        challenge: {
          read: true,
        },
        food: {
          read: true,
        },
        foodChain: {
          read: true,
        },
        home: {
          read: true,
        },
        jellyfish: {
          read: true,
        },
        progress: {
          read: {
            filter: "accessControl/filters/progress/tenant.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        user: {
          read: {
            filter: "accessControl/filters/user/tenant.gelly",
          },
          actions: {
            changePassword: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
            signOut: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
            update: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
          },
        },
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        challenge: {
          read: true,
        },
        food: {
          read: true,
        },
        foodChain: {
          read: true,
        },
        home: {
          read: true,
        },
        jellyfish: {
          read: true,
        },
        user: {
          actions: {
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signUp: true,
            verifyEmail: true,
          },
        },
      },
    },
  },
};
