import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {  inDb } from './db.js'; 
import {typeDefs} from './schemas.js';
import {resolvers} from './mutations.js';

await inDb();
//Creates the server - Here’s my schema and logic — expose it as an API
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


// this starts the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});