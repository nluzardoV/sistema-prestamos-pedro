const fs = require('fs');
const db = require('better-sqlite3')('prestamos.db');
try {
  const info = db.prepare("PRAGMA table_info(prestamo)").all();
  fs.writeFileSync('pragma.txt', JSON.stringify(info, null, 2));
} catch(e) {
  fs.writeFileSync('pragma.txt', e.message);
}
