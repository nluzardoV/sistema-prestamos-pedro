const db = require('better-sqlite3')('prestamos.db');
console.log('Usuarios:', db.prepare('SELECT id, username, empleado_id FROM usuario').all());
try {
    console.log('Préstamos:', db.prepare('SELECT id, empleadoId FROM prestamo').all());
} catch(e) {
    console.log(e.message);
}
