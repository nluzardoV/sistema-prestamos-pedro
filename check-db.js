const db = require('better-sqlite3')('prestamos.db');
const usuarios = db.prepare('SELECT id, username, empleado_id FROM usuario').all();
const prestamos = db.prepare('SELECT id, empleadoId FROM prestamo').all();
console.log(JSON.stringify({usuarios, prestamos}, null, 2));
