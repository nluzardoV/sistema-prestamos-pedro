import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { EstadoPago } from './pago-cuota.enum';
import { Prestamo } from '../prestamo/prestamo.entity';

@Entity()
export class PagoCuota {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Prestamo, (prestamo) => prestamo.pagos)
  prestamo: Prestamo;

  @Column()
  numero_quincena: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto_esperado: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  monto_pagado: number;

  @Column({ type: 'date', nullable: true })
  fecha_esperada: string;

  @Column({ nullable: true })
  fecha_pago: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  recargo_fijo: number;

  @Column({ type: 'varchar', default: EstadoPago.PENDIENTE })
  estado: EstadoPago;

  @CreateDateColumn()
  created_at: Date;
}
