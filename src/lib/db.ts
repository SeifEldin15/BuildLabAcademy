import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'nextauth_user',
  database: 'buildlab_db',
  password: 'nextauth_pass123',
  ssl: false,
});

export default pool;
