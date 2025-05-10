// functions/zitate-list.ts
import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);   // Neon-URL als ENV-Var

export const handler: Handler = async () => {
  try {
    const rows = await sql`
      SELECT id, zitat, autor
      FROM   zitate
      ORDER BY random()
      LIMIT  1
    `;
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(rows),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'DB-Error' };
  }

};