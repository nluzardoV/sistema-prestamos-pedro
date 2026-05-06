import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmpresaModule } from './empresa/empresa.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { PrestamoModule } from './prestamo/prestamo.module';
import { PagoCuotaModule } from './pago-cuota/pago-cuota.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { AuthModule } from './auth/auth.module';
import { EquipoModule } from './equipo/equipo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:prueba123.,@db.kbuaxipcmexwsqpngpqx.supabase.co:5432/postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Ideal dejarlo en true ahora para que cree las tablas en Supabase
    }),
    EmpresaModule,
    EmpleadoModule,
    PrestamoModule,
    PagoCuotaModule,
    ConfiguracionModule,
    AuthModule,
    EquipoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
