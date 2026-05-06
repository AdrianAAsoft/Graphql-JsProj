//esquema para saber que existe?  - !means required or not null
//query is the name of the function and it returns list of users similar to a Get/users
//Mutation es un put or post
export const typeDefs = `#graphql
    type User{
    id: ID!  
    name: String!
    item: Item
    }

    type Item{
    id: ID!
    description: String!
    price: Float
    quantity: Int!
    }

    type Query{
    users: [User] 
    items: [Item]
    SpecificUsers(id: ID!): User
    }

    type Mutation{
    createUsr(name: String!, item: ID): User 
    updateUsr(id: ID!, name: String, item: ID): User 
    createItm(descript: String!, price: Float, quantity: Int!): Item
    updateItm(id: ID!, descript: String, price: Float, quantity: Int): Item
    }
`