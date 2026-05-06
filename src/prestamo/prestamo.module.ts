import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './prestamo.entity';
import { PagoCuota } from '../pago-cuota/pago-cuota.entity';
import { PrestamoService } from './prestamo.service';
import { PrestamoController } from './prestamo.controller';
import { EmpleadoModule } from '../empleado/empleado.module';
import { ConfiguracionModule } from '../configuracion/configuracion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prestamo, PagoCuota]),
    EmpleadoModule,
    ConfiguracionModule,
  ],
  providers: [PrestamoService],
  controllers: [PrestamoController],
  exports: [PrestamoService],
})
export class PrestamoModule {}
