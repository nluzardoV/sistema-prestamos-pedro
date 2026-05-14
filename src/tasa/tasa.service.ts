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
    let paralelo: number | null = null;

    for (const tipo of tipos) {
      const tasaApi = tasas.find((item) => this.esTipoTasa(item, tipo));
      const valor = Number(tasaApi?.promedio || tasaApi?.valor || tasaApi?.venta || tasaApi?.precio);

      if (!Number.isFinite(valor) || valor <= 0) continue;

      let tasa = await this.repo.findOne({ where: { tipo } });
      if (!tasa) tasa = this.repo.create({ tipo });
      tasa.valor = valor;
      actualizadas.push(await this.repo.save(tasa));
      if (tipo === TipoTasa.PARALELO) paralelo = valor;
    }

    const binance = await this.obtenerTasaBinance(paralelo);
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

  private async obtenerTasaBinance(paralelo: number | null): Promise<number | null> {
    const { data } = await axios.post('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      asset: 'USDT',
      fiat: 'VES',
      merchantCheck: false,
      page: 1,
      payTypes: [],
      publisherType: null,
      rows: 10,
      tradeType: 'SELL',
    });

    const precios = Array.isArray(data?.data)
      ? data.data
          .map((item) => Number(item?.adv?.price))
          .filter((precio) => Number.isFinite(precio) && precio > 0)
          .sort((a, b) => a - b)
      : [];

    if (!precios.length) return null;

    const medio = Math.floor(precios.length / 2);
    const mediana = precios.length % 2 === 0
      ? (precios[medio - 1] + precios[medio]) / 2
      : precios[medio];

    if (paralelo && Math.abs((mediana - paralelo) / paralelo) > 0.2) return null;

    return mediana;
  }
}
