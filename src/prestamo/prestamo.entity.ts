import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Empleado } from '../empleado/empleado.entity';
import { PagoCuota } from '../pago-cuota/pago-cuota.entity';

export enum EstadoPrestamo {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  AUTORIZADO_ESPECIAL = 'AUTORIZADO_ESPECIAL',
}

@Entity()
export class Prestamo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Empleado, (empleado) => empleado.prestamos)
  empleado: Empleado;

  @Column('decimal', { precision: 10, scale: 2 })
  costo_equipo: number;

  @Column('decimal', { precision: 10, scale: 2 })
  factor: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_venta: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cuota_quincenal: number;

  @Column({ default: 0 })
  quincenas_pagadas: number;

  @Column({ type: 'varchar', default: EstadoPrestamo.PENDIENTE })
  estado: EstadoPrestamo;

  @Column({ type: 'varchar', nullable: true })
  autorizado_por: string | null;

  @Column({ type: 'varchar', nullable: true })
  comentario: string | null;

  @OneToMany(() => PagoCuota, (pago) => pago.prestamo, { cascade: true })
  pagos: PagoCuota[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
