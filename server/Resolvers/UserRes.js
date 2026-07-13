import { pool } from '../db.js';
import {pubsub} from './subRes.js'
import { hashPassword, verifyPassword } from '../passwordUtils.js'
import { signToken, requireAuth } from '../auth.js'
import { GraphQLError } from 'graphql'

export const Userresolvers = {
    Query: {
        users: async (_, __, ctx) => {
            requireAuth(ctx);
            const res = await pool.query("select * from users");
            return res.rows; },
        SpecificUsers: async (_, {id}, ctx) => {
            requireAuth(ctx);
            const res = await pool.query(`
                select * from users where id = $1`,[id]);
                return res.rows[0];
        }
    },
    Mutation: {
        // public: this is the register path (no token required)
        createUsr: async (_, {name, item, username, password, email}) => {
            // never store the raw password — keep only a scrypt hash
            const pass = password ? hashPassword(password) : null;
            const res = await pool.query(
                "Insert into users(name, item, username, password, email) VALUES($1, $2, $3, $4, $5) returning *",
                [name, item, username, pass, email]
            );
            return res.rows[0];
        },
        // public: exchange credentials for a JWT
        login: async (_, { username, password }) => {
            const res = await pool.query("select * from users where username = $1", [username]);
            const user = res.rows[0];
            // same generic error whether the user is missing or the password is wrong,
            // so we don't reveal which usernames exist. BAD_CREDENTIALS (not UNAUTHENTICATED)
            // so the client shows a login error instead of triggering an auto-logout.
            if (!user || !verifyPassword(password, user.password)) {
                throw new GraphQLError("Invalid credentials", {
                    extensions: { code: "BAD_CREDENTIALS" },
                });
            }
            await pool.query(
                "insert into logs(level, message) values($1, $2)",
                ["auth", `LOGIN // ${user.username}`]
            );
            return { token: signToken(user), user };
        },
        updateUsr: async (_, {id, name, item, username, password, email}, ctx) => {
            requireAuth(ctx);
            const pass = password ? hashPassword(password) : null;
            const res = await pool.query(
                `Update users set
                    name = COALESCE($1, name),
                    item = COALESCE($2, users.item),
                    username = COALESCE($3, username),
                    password = COALESCE($4, password),
                    email = COALESCE($5, email)
                 where id = $6 returning *`,
                [name, item, username, pass, email, id]
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