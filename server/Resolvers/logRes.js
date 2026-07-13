import { pool } from '../db.js';
import { requireAuth } from '../auth.js'

export const Logresolvers = {
    Query: {
        logs: async (_, __, ctx) => {
            requireAuth(ctx);
            const res = await pool.query("select * from logs order by created_at desc limit 200");
            return res.rows;
        },
    },
    Mutation: {
        createLog: async (_, { level, message }, ctx) => {
            requireAuth(ctx);
            const res = await pool.query(
                "Insert into logs(level, message) VALUES($1, $2) returning *",
                [level || 'info', message]
            );
            return res.rows[0];
        },
    },
    Log: {
        created_at: (parent) => new Date(parent.created_at).toISOString(),
    },
}
