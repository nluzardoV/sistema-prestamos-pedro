import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PrestamoService } from './prestamo/prestamo.service';
import { AuthService } from './auth/auth.service';
const Database = require('better-sqlite3');

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prestamoService: PrestamoService
  ) {}

  @Get('/debug2')
  getDebug2() {
    const db = new Database('prestamos.db');
    const usuarios = db.prepare('SELECT id, username, empleado_id FROM usuario').all();
    const prestamos = db.prepare('SELECT id, empleadoId FROM prestamo').all();
    db.close();
    return { usuarios, prestamos };
  }

  @Get('/debug/clean-usuarios')
  cleanUsuarios() {
    const db = new Database('prestamos.db');
    const info = db.prepare('DELETE FROM usuario WHERE empleado_id IS NOT NULL AND empleado_id NOT IN (SELECT id FROM empleado)').run();
    db.close();
    return { mensaje: 'Usuarios huérfanos eliminados', eliminados: info.changes };
  }

  @Get('/debug3')
  async debug3() {
    const prestamos = await this.prestamoService.listar();
    return prestamos.map(p => ({
      id: p.id,
      cliente: p.empleado?.nombre,
      estado: p.estado
    }));
  }



  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
