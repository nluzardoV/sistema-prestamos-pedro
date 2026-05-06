import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracion } from './configuracion.entity';

@Injectable()
export class ConfiguracionService implements OnModuleInit {
  constructor(
    @InjectRepository(Configuracion)
    private repo: Repository<Configuracion>,
  ) {}

  async onModuleInit() {
    const defaults = [
      { clave: 'FACTOR_PRECIO', valor: '3.8' },
      { clave: 'IVA', valor: '0.16' },
      { clave: 'LIMITE_LIQUIDACION_PCT', valor: '70' },
      { clave: 'MESES_ANTIGUEDAD_MIN', valor: '6' },
      { clave: 'QUINCENAS', valor: '24' },
    ];
    for (const d of defaults) {
      const existe = await this.repo.findOne({ where: { clave: d.clave } });
      if (!existe) await this.repo.save(d);
    }
  }

  async get(clave: string): Promise<number> {
    const config = await this.repo.findOne({ where: { clave } });
    return config ? parseFloat(config.valor) : 0;
  }

  async set(clave: string, valor: string): Promise<Configuracion> {
    let config = await this.repo.findOne({ where: { clave } });
    if (!config) config = this.repo.create({ clave });
    config.valor = valor;
    return this.repo.save(config);
  }

  async getAll(): Promise<Configuracion[]> {
    return this.repo.find();
  }
}
