import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { PrestamoService } from './prestamo/prestamo.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prestamoService: PrestamoService
  ) {}

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
