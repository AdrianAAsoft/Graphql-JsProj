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
    type Item{
    id: ID!
    description: string!
    price: float
    quantity: int!
    }

    type Query{
    users: [User] 
    items: [Item]
    }

    type Mutation{
    createUsr(name: String!): User 
    createItm(descript: string!, price: float, quantity : int!): Item
    updateItm(id: ID!, descript: strign, price: floar, quantity: int): Item
    }
`

// reolvers for how to create or consume data (its how scheme works)
//resolvers para el como crear o consumir data (como funciona lo del esquema)
const resolvers = {
    Query: {
        users: async () => {
            const res = await pool.query("select * from users");
            return res.rows; 
        },
        items: async () => {
            const res = await pool.query("select * from items");
            return res.rows;
        }
    },
    Mutation: {
        createUsr: async (_, {name}) => {
            const res = await pool.query(
                "Insert into users(name) VALUES($1) Returning *",
                [name]
            );
            return res.rows[0];
        },
        createItm: async (_, {descript, price, quantity}) => {
            const res = await pool.query("Insert into items(description,price,quantity) VALUES($1,$2,$3) returning *",
                [descript, price,quantity]
            );
            return res.rows[0];
        },
        updateItm: async (_, { id, descript, price, quantity }) => {
            const res = await pool.query(`Update items set        
                                    description = COALESCE($1, description),
                                    price = COALESCE($2, price),
                                    quantity = COALESCE($3, quantity) where id = $4 returning *`,
                [descript, price, quantity, id]
            );
            return res.rows[0];
        }
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