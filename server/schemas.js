//esquema para saber que existe?  - !means required or not null
//query is the name of the function and it returns list of users similar to a Get/users
//Mutation es un put or post
export const typeDefs = `#graphql
    type User{
    id: ID!
    name: String!
    username: String
    email: String
    item: Item
    }

    type Item{
    id: ID!
    description: String!
    price: Float
    quantity: Int!
    }

    type Log{
    id: ID!
    level: String!
    message: String!
    created_at: String!
    }

    # returned by login: a JWT (valid 30 min) plus the authenticated user
    type AuthPayload{
    token: String!
    user: User!
    }

    type Query{
    users: [User]
    items: [Item]
    logs: [Log]
    SpecificUsers(id: ID!): User
    }

    type Mutation{
    createUsr(name: String!, item: ID, username: String, password: String, email: String): User
    updateUsr(id: ID!, name: String, item: ID, username: String, password: String, email: String): User
    createItm(descript: String!, price: Float, quantity: Int!): Item
    updateItm(id: ID!, descript: String, price: Float, quantity: Int): Item
    createLog(level: String, message: String!): Log
    login(username: String!, password: String!): AuthPayload
    }

    type Subscription{
    itemCreated: Item,
    usrUpdated: User
    }

`