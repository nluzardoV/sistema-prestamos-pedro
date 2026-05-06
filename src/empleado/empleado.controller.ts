import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { Empleado } from './empleado.entity';

@Controller('empleados')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  crear(@Body() data: Partial<Empleado>) {
    return this.empleadoService.crear(data);
  }

  @Get()
  listar() {
    return this.empleadoService.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.empleadoService.buscarPorId(+id);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() data: Partial<Empleado>) {
    return this.empleadoService.actualizar(+id, data);
  }
  @Delete(':id')
async eliminar(@Param('id') id: string) {
  await this.empleadoService.eliminar(+id);
  return { mensaje: 'Cliente eliminado exitosamente' };
}
}
