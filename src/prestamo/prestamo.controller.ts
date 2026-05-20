import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrestamoService } from './prestamo.service';

@Controller('prestamos')
export class PrestamoController {
  constructor(private readonly prestamoService: PrestamoService) {}

  @Post()
  crear(
    @Body()
    body: {
      empleadoId: number;
      costoEquipo: number;
      autorizadoPor?: string;
      quincenas?: number;
    },
  ) {
    return this.prestamoService.crear(
      body.empleadoId,
      body.costoEquipo,
      body.autorizadoPor,
      body.quincenas,
    );
  }

  @Get()
  listar() {
    return this.prestamoService.listar();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('cliente')
  async buscarPorCliente(@Request() req: any) {
    console.log("=== DEBUG GET /prestamos/cliente ===");
    console.log("User from token:", req.user);
    const prestamos = await this.prestamoService.buscarPorEmpleado(req.user.empleado_id);
    console.log("Found prestamos:", prestamos.length);
    return prestamos;
  }

  @Get('debug/dump')
  async debugDump() {
    const prestamos = await this.prestamoService.listar();
    return prestamos.map(p => ({
      id: p.id,
      empleadoId: p.empleado?.id,
      empleadoNombre: p.empleado?.nombre,
    }));
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.prestamoService.buscarPorId(+id);
  }

  @Post('pago/:pagoId')
  registrarPago(
    @Param('pagoId') pagoId: string,
    @Body() body: { montoPagado: number; recargoFijo?: number },
  ) {
    return this.prestamoService.registrarPago(
      +pagoId,
      body.montoPagado,
      body.recargoFijo,
    );
  }

  @Post('mora/:pagoId')
  marcarMora(
    @Param('pagoId') pagoId: string,
    @Body() body: { recargoFijo: number },
  ) {
    return this.prestamoService.marcarMora(+pagoId, body.recargoFijo);
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    await this.prestamoService.eliminar(+id);
    return { mensaje: 'Préstamo eliminado exitosamente' };
  }
}
