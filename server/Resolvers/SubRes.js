import { PubSub } from "graphql-subscriptions";
export const pubsub = new PubSub();

export const SubRes = {
  Subscription: {
    itemCreated: {
        subscribe: () => pubsub.asyncIterableIterator(["itemCreated"])
    },
    usrUpdated: {
        subscribe: () => pubsub.asyncIterableIterator(["usrUpdated"])
    },
  },
};
