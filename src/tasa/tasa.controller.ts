import { Controller, Get } from '@nestjs/common';
import { TasaService } from './tasa.service';

@Controller('tasas')
export class TasaController {
  constructor(private readonly tasaService: TasaService) {}

  @Get()
  obtenerTasas() {
    return this.tasaService.obtenerTasas();
  }
}
