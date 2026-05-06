import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoCuota } from './pago-cuota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PagoCuota])],
})
export class PagoCuotaModule {}
