import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { pool, inDb } from './db.js'; 

await inDb();


//esquema para saber que existe?  - !means required or not null
//query is the name of the function and it returns list of users similar to a Get/users
//Mutation es un put or post
const typeDefs = `#graphql
    type User{
    id: ID!  
    name: String!
    }

    type Query{
    users: [User] }

    type Mutation{
    createUsr(name: String!): User }

`

// reolvers for how to create or consume data (its how scheme works)
//resolvers para el como crear o consumir data (como funciona lo del esquema)
const resolvers = {
    Query: {
        users: async () => {
            const res = await pool.query("select * from users");
            return res.rows; 
        },
    },
    Mutation: {
        createUsr: async (_, {name}) => {
            const res = await pool.query(
                "Insert into users(name) VALUES($1) Returning *",
                [name]
            );
            return res.rows[0];
        },
    },
    
}

//Creates the server - Here’s my schema and logic — expose it as an API
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


// this starts the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});