const { Pool } = require('pg');

async function testConnection() {
  const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    user: 'nextauth_user',
    database: 'buildlab_db',
    password: 'nextauth_pass123',
    ssl: false,
  });

  try {
    console.log('Testing connection...');
    const result = await pool.query('SELECT current_user, current_database()');
    console.log('✅ Success:', result.rows[0]);
    
    // Test accounts table access
    const accounts = await pool.query('SELECT COUNT(*) FROM accounts');
    console.log('✅ Accounts table accessible');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

testConnection();
