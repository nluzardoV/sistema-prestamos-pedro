import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmpresaModule } from './empresa/empresa.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { PrestamoModule } from './prestamo/prestamo.module';
import { PagoCuotaModule } from './pago-cuota/pago-cuota.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'prestamos.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    EmpresaModule,
    EmpleadoModule,
    PrestamoModule,
    PagoCuotaModule,
    ConfiguracionModule,
    AuthModule,
  ],
})
export class AppModule {}