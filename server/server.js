import { webcrypto } from "crypto";
globalThis.crypto = webcrypto;

import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5"; // change this line
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from 'graphql-ws/use/ws';
import express from "express";
import http from "http";
import { inDb } from "./db.js";
import { typeDefs } from "./schemas.js";
import { resolvers } from "./mutations.js";

await inDb();
//Creates the server - Here’s my schema and logic — expose it as an API
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = http.createServer(app);

// WebSocket server for subscriptions
const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});


// this starts the server
await server.start();
wsServer.on('connection', () => {
  console.log('WebSocket client connected');
});
app.use("/graphql", express.json(), expressMiddleware(server));

httpServer.listen(4000, '0.0.0.0', () => {
  console.log('Server listening on port 4000');
  
  // move this here
  const serverCleanup = useServer({ schema }, wsServer);
  
}).on('error', (err) => {
  console.error('Server error:', err);
});

httpServer.on('upgrade', (request, socket, head) => {
  console.log('Upgrade request received:', request.url);
  console.log('Protocols:', request.headers['sec-websocket-protocol']);
}); 
