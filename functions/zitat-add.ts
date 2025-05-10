// functions/zitat-add.ts
import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { zitat, autor } = JSON.parse(event.body || '{}');
  if (!zitat || !autor) {
    return { statusCode: 400, body: 'zitat und autor erforderlich' };
  }

  try {
    const [row] = await sql`
      INSERT INTO zitate (zitat, autor)
      VALUES (${zitat}, ${autor})
      RETURNING id, zitat, autor
    `;
    return {
      statusCode: 201,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(row),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'DB-Error' };
  }
};
