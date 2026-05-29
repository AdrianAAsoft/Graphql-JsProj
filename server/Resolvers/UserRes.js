import { pool } from '../db.js'; 
import {pubsub} from './SubRes.js'

export const Userresolvers = {
    Query: {
        users: async () => {
            const res = await pool.query("select * from users");
            return res.rows; },
        SpecificUsers: async (_, {id}) => {
            const res = await pool.query(`
                select * from users where id = $1`,[id]);
                return res.rows[0];
        } 
    },
    Mutation: {
        createUsr: async (_, {name, item}) => {
            const res = await pool.query(
                "Insert into users(name, item) VALUES($1, $2) returning *",
                [name, item]
            );
            return res.rows[0];
        },
        updateUsr: async (_, {id,name, item}) => {
            const res = await pool.query(
                "Update users set name = COALESCE($1, name),  item = COALESCE($2, users.item) where id = $3 returning *",
                [name, item, id]
            );
            pubsub.publish("usrUpdated", {usrUpdated: res.rows[0]})
            return res.rows[0];
        },
    },
    User: {
        item: async (parent) => {
            const res = await pool.query("select * from items where id = $1", [parent.item]);
            return res.rows[0];
        }
    }

}