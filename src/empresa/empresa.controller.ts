import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { EmpresaService } from './empresa.service';
import { Empresa } from './empresa.entity';

@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  crear(@Body() data: Partial<Empresa>) {
    return this.empresaService.crear(data);
  }

  @Get()
  listar() {
    return this.empresaService.listar();
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.empresaService.buscarPorId(+id);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() data: Partial<Empresa>) {
    return this.empresaService.actualizar(+id, data);
  }
}
