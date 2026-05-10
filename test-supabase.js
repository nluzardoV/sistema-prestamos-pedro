const { Client } = require('pg');

// La clave tiene caracteres especiales (, y .), así que los codificamos de forma segura para la URL
const password = encodeURIComponent('Pagina123.,');
const url = `postgresql://postgres.kbuaxipcmexwsqpngpqx:${password}@aws-1-us-east-1.pooler.supabase.com:5432/postgres`;

console.log("Intentando conectar a Supabase con la nueva clave codificada...");

const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log("====================================");
    console.log("✅ CONEXIÓN EXITOSA LOCALMENTE ✅");
    console.log("La clave funciona perfectamente.");
    console.log("URL CORRECTA A PEGAR EN RENDER:");
    console.log(url);
    console.log("====================================");
    client.end();
  })
  .catch(err => {
    console.log("====================================");
    console.error("❌ ERROR DE AUTENTICACIÓN LOCAL ❌");
    console.error(err.message);
    console.log("Supabase sigue rechazando la conexión. Si acabas de cambiar la clave, espera 3 minutos.");
    console.log("====================================");
    client.end();
  });
