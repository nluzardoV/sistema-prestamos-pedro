import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasaController } from './tasa.controller';
import { Tasa } from './tasa.entity';
import { TasaService } from './tasa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tasa])],
  providers: [TasaService],
  controllers: [TasaController],
  exports: [TasaService],
})
export class TasaModule {}
