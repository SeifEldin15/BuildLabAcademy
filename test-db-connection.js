// Test database connection with exact same setup as NextAuth
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://buildlab_user@127.0.0.1:5432/buildlab_db',
  ssl: false,
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT current_user, current_database()');
    console.log('✅ Connection successful:', result.rows[0]);
    
    // Test if we can query the accounts table
    const accountsTest = await pool.query('SELECT COUNT(*) FROM accounts');
    console.log('✅ Accounts table accessible, count:', accountsTest.rows[0].count);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
  }
}

testConnection();
