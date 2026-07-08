import { PubSub } from "graphql-subscriptions";
export const pubsub = new PubSub();

export const SubRes = {
  Subscription: {
    itemCreated: {
<<<<<<< HEAD
        subscribe: () => pubsub.asyncIterableIterator(["itemCreated"])
    },
    usrUpdated: {
        subscribe: () => pubsub.asyncIterableIterator(["usrUpdated"])
=======
        subscribe: () => pubsub.asyncIterator(["itemCreated"])
    },
    usrUpdated: {
        subscribe: () => pubsub.asyncIterator(["usrUpdated"])
>>>>>>> d1df3aa (Updatesthink)
    },
  },
};
