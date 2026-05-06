import { mergeResolvers } from '@graphql-tools/merge';
import { Userresolvers } from './Resolvers/UserRes.js';
import { Itemresolvers } from './Resolvers/ItemRes.js';

// reolvers for how to create or consume data (its how scheme works)
//resolvers para el como crear o consumir data (como funciona lo del esquema)
// resolvers are always (parent, args, context, info) - parent is the result of the previous resolver

export const resolvers = mergeResolvers([Userresolvers, Itemresolvers]);
