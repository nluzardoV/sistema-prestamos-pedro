import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EmpresaModule } from './empresa/empresa.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { PrestamoModule } from './prestamo/prestamo.module';
import { PagoCuotaModule } from './pago-cuota/pago-cuota.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { AuthModule } from './auth/auth.module';
import { EquipoModule } from './equipo/equipo.module';
import { TasaModule } from './tasa/tasa.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    EmpresaModule,
    EmpleadoModule,
    PrestamoModule,
    PagoCuotaModule,
    ConfiguracionModule,
    AuthModule,
    EquipoModule,
    TasaModule,
  ],
})
export class AppModule {}

