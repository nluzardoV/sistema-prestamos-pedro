const { Client } = require('pg');

const url = 'postgresql://postgres.kbuaxipcmexwsqpngpqx:Miclave2026@aws-1-us-east-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log("✅ CONEXION EXITOSA A SUPABASE!");
    client.end();
  })
  .catch(err => {
    console.error("❌ ERROR DE CONEXION:", err.message);
    client.end();
  });
