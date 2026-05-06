const fs = require('fs');
const db = require('better-sqlite3')('prestamos.db');

try {
  const usuarios = db.prepare('SELECT id, username, empleado_id FROM usuario').all();
  const prestamos = db.prepare('SELECT id, empleadoId FROM prestamo').all();
  fs.writeFileSync('db-dump.txt', JSON.stringify({ usuarios, prestamos }, null, 2));
} catch(e) {
  fs.writeFileSync('db-dump.txt', e.message);
}
