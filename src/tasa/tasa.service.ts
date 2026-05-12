import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { Tasa, TipoTasa } from './tasa.entity';

@Injectable()
export class TasaService implements OnModuleInit {
  constructor(
    @InjectRepository(Tasa)
    private repo: Repository<Tasa>,
  ) {}

  async onModuleInit() {
    await this.actualizarTasas();
  }

  @Cron('*/30 * * * *')
  async actualizarTasas(): Promise<Tasa[]> {
    const { data } = await axios.get('https://ve.dolarapi.com/v1/dolares');
    const tasas = Array.isArray(data) ? data : [];
    const tipos = [TipoTasa.BCV, TipoTasa.PARALELO];
    const actualizadas: Tasa[] = [];

    for (const tipo of tipos) {
      const tasaApi = tasas.find((item) => this.esTipoTasa(item, tipo));
      const valor = Number(tasaApi?.promedio || tasaApi?.valor || tasaApi?.venta || tasaApi?.precio);

      if (!Number.isFinite(valor) || valor <= 0) continue;

      let tasa = await this.repo.findOne({ where: { tipo } });
      if (!tasa) tasa = this.repo.create({ tipo });
      tasa.valor = valor;
      actualizadas.push(await this.repo.save(tasa));
    }

    const binance = await this.obtenerTasaBinance();
    if (binance) {
      let tasa = await this.repo.findOne({ where: { tipo: TipoTasa.BINANCE } });
      if (!tasa) tasa = this.repo.create({ tipo: TipoTasa.BINANCE });
      tasa.valor = binance;
      actualizadas.push(await this.repo.save(tasa));
    }

    return actualizadas;
  }

  async obtenerTasas(): Promise<Tasa[]> {
    return this.repo.find({ order: { tipo: 'ASC' } });
  }

  private esTipoTasa(item: Record<string, unknown>, tipo: TipoTasa): boolean {
    const texto = `${item.fuente || ''} ${item.nombre || ''}`.toUpperCase();

    if (tipo === TipoTasa.BCV) return texto.includes('BCV') || texto.includes('OFICIAL');
    if (tipo === TipoTasa.PARALELO) return texto.includes('PARALELO');
    if (tipo === TipoTasa.BINANCE) return texto.includes('BINANCE');

    return false;
  }

  private async obtenerTasaBinance(): Promise<number | null> {
    const { data } = await axios.post('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      asset: 'USDT',
      fiat: 'VES',
      merchantCheck: false,
      page: 1,
      payTypes: [],
      publisherType: null,
      rows: 1,
      tradeType: 'SELL',
    });

    const precio = Number(data?.data?.[0]?.adv?.price);
    return Number.isFinite(precio) && precio > 0 ? precio : null;
  }
}
