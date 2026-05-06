const Database = require('better-sqlite3');
const db = new Database('prestamos.db');

const prestamos = db.prepare(`
  SELECT p.id, e.nombre, p.costo_equipo, p.estado 
  FROM prestamo p
  JOIN empleado e ON p.empleadoId = e.id
`).all();

console.log(JSON.stringify(prestamos, null, 2));
