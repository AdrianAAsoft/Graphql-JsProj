import { PubSub } from "graphql-subscriptions";
export const pubsub = new PubSub();

export const SubRes = {
  Subscription: {
    itemCreated: {
        subscribe: () => pubsub.asyncIterator(["itemCreated"])
    },
    usrUpdated: {
        subscribe: () => pubsub.asyncIterator(["usrUpdated"])
    },
  },
};
