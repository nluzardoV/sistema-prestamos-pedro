import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Prestamo, EstadoPrestamo } from './prestamo.entity';
import { PagoCuota } from '../pago-cuota/pago-cuota.entity';
import { EstadoPago } from '../pago-cuota/pago-cuota.enum';
import { EmpleadoService } from '../empleado/empleado.service';
import { ConfiguracionService } from '../configuracion/configuracion.service';

function calcularFechasQuincenas(fechaInicio: Date, cantidad: number): string[] {
  const fechas: string[] = [];
  let current = new Date(fechaInicio);
  for (let i = 0; i < cantidad; i++) {
    const day = current.getDate();
    const month = current.getMonth();
    const year = current.getFullYear();

    if (day < 15) {
      fechas.push(`${year}-${String(month + 1).padStart(2, '0')}-15`);
      current = new Date(year, month, 16);
    } else {
      const lastDay = new Date(year, month + 1, 0).getDate();
      fechas.push(`${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`);
      current = new Date(year, month + 1, 1);
    }
  }
  return fechas;
}

@Injectable()
export class PrestamoService {
  constructor(
    @InjectRepository(Prestamo)
    private prestamoRepo: Repository<Prestamo>,
    @InjectRepository(PagoCuota)
    private pagoRepo: Repository<PagoCuota>,
    private empleadoService: EmpleadoService,
    private configService: ConfiguracionService,
  ) {}

  async crear(
    empleadoId: number,
    costoEquipo: number,
    pagoInicialParam?: number,
    gananciaInteresParam?: number,
    autorizadoPor?: string,
    quincenasParam?: number,
  ) {
    const empleado = await this.empleadoService.buscarPorId(empleadoId);

    // 1. Obtener préstamos activos del cliente
    const prestamosAnteriores = await this.prestamoRepo.find({
      where: {
        empleado: { id: empleadoId },
        estado: In([EstadoPrestamo.APROBADO, EstadoPrestamo.AUTORIZADO_ESPECIAL, EstadoPrestamo.PENDIENTE]),
      },
      relations: ['pagos'],
    });

    // 2. Estado de Mora
    const tieneMora = prestamosAnteriores.some((p) =>
      p.pagos.some((pago) => pago.estado === EstadoPago.MORA),
    );
    if (tieneMora) {
      throw new BadRequestException(
        'El cliente se encuentra bloqueado para nuevos préstamos por tener cuotas en mora.',
      );
    }

    // 3. Suma de deudas
    const deudaAnterior = prestamosAnteriores.reduce(
      (sum, p) => sum + Number(p.precio_venta),
      0,
    );

    const quincenas = quincenasParam || Number(await this.configService.get('QUINCENAS')) || 24;
    const pagoInicial = Number(pagoInicialParam) || 0;
    const gananciaInteres = Number(gananciaInteresParam) || 0;
    const saldoRestante = Math.max(Number(costoEquipo) - pagoInicial, 0);
    const precioVenta = saldoRestante + gananciaInteres;
    const cuotaQuincenal = precioVenta / quincenas;

    const prestamo = new Prestamo();
    prestamo.empleado = empleado;
    prestamo.costo_equipo = costoEquipo;
    prestamo.pago_inicial = pagoInicial;
    prestamo.ganancia_interes = gananciaInteres;
    prestamo.precio_venta = precioVenta;
    prestamo.cuota_quincenal = cuotaQuincenal;
    prestamo.estado = autorizadoPor
      ? EstadoPrestamo.AUTORIZADO_ESPECIAL
      : EstadoPrestamo.APROBADO;
    prestamo.autorizado_por = autorizadoPor ?? null;

    const prestamoGuardado = await this.prestamoRepo.save(prestamo);

    const fechasEsperadas = calcularFechasQuincenas(new Date(), quincenas);

    const pagos: PagoCuota[] = [];
    for (let i = 1; i <= quincenas; i++) {
      const pago = new PagoCuota();
      pago.prestamo = prestamoGuardado;
      pago.numero_quincena = i;
      pago.monto_esperado = cuotaQuincenal;
      pago.estado = EstadoPago.PENDIENTE;
      pago.recargo_fijo = 0;
      pago.fecha_esperada = fechasEsperadas[i - 1];
      pagos.push(pago);
    }
    await this.pagoRepo.save(pagos);

    return {
      alerta: false,
      prestamo: prestamoGuardado,
      mensaje: `✅ Préstamo aprobado. Cuota quincenal: $${cuotaQuincenal.toFixed(2)}`,
    };
  }

  async listar(): Promise<Prestamo[]> {
    return this.prestamoRepo.find({
      relations: ['empleado', 'empleado.empresa', 'pagos'],
    });
  }

  async buscarPorId(id: number): Promise<Prestamo> {
    const prestamo = await this.prestamoRepo.findOne({
      where: { id },
      relations: ['empleado', 'empleado.empresa', 'pagos'],
    });
    if (!prestamo) throw new NotFoundException(`Préstamo #${id} no encontrado`);
    return prestamo;
  }

  async buscarPorEmpleado(empleadoId: number | string): Promise<Prestamo[]> {
    const id = Number(empleadoId);
    if (!id || isNaN(id)) return [];
    
    return this.prestamoRepo.createQueryBuilder('prestamo')
      .leftJoinAndSelect('prestamo.pagos', 'pagos')
      .leftJoinAndSelect('prestamo.empleado', 'empleado')
      .where('empleado.id = :id', { id })
      .getMany();
  }

  async registrarPago(pagoId: number, montoPagado: number, recargoFijo = 0) {
    const pago = await this.pagoRepo.findOne({
      where: { id: pagoId },
      relations: ['prestamo'],
    });
    if (!pago) throw new NotFoundException(`Pago #${pagoId} no encontrado`);

    pago.monto_pagado = montoPagado;
    pago.recargo_fijo = recargoFijo;
    pago.fecha_pago = new Date().toISOString().split('T')[0];
    pago.estado = EstadoPago.PAGADO;
    await this.pagoRepo.save(pago);

    const prestamo = await this.buscarPorId(pago.prestamo.id);
    prestamo.quincenas_pagadas = prestamo.pagos.filter(
      (p) => p.estado === EstadoPago.PAGADO,
    ).length;
    await this.prestamoRepo.save(prestamo);

    return {
      mensaje: `✅ Quincena #${pago.numero_quincena} registrada como pagada.`,
      pago,
    };
  }

  async marcarMora(pagoId: number, recargoFijo: number) {
    const pago = await this.pagoRepo.findOne({ where: { id: pagoId } });
    if (!pago) throw new NotFoundException(`Pago #${pagoId} no encontrado`);
    pago.estado = EstadoPago.MORA;
    pago.recargo_fijo = recargoFijo;
    await this.pagoRepo.save(pago);
    return {
      mensaje: `🔴 Quincena #${pago.numero_quincena} marcada en mora. Recargo: $${recargoFijo}`,
      pago,
    };
  }
  async eliminar(id: number): Promise<void> {
    await this.prestamoRepo.query(`DELETE FROM pago_cuota WHERE "prestamoId" = ${id}`);
    await this.prestamoRepo.delete(id);
  }
}

