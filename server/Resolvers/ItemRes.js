import { pool } from '../db.js'; 

export const Itemresolvers = {
    Query: {
        items: async () => {
            const res = await pool.query("select * from items");
            return res.rows;
        },
    },
    Mutation: {
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
    }
}