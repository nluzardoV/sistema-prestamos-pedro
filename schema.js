const fs = require('fs');
const db = require('better-sqlite3')('prestamos.db');
try {
  const prestamoCols = db.prepare("PRAGMA table_info(prestamo)").all();
  const usuarioCols = db.prepare("PRAGMA table_info(usuario)").all();
  fs.writeFileSync('schema-dump.txt', JSON.stringify({ prestamoCols, usuarioCols }, null, 2));
} catch(e) {
  fs.writeFileSync('schema-dump.txt', e.message);
}
