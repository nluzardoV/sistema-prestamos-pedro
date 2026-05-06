import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Prestamo } from '../prestamo/prestamo.entity';

@Entity()
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  cedula: string;

  @Column()
  cargo: string;

  @Column()
  fecha_ingreso: string;

  @Column('decimal', { precision: 10, scale: 2 })
  salario_neto: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto_liquidacion_actual: number;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => Empresa, (empresa) => empresa.empleados)
  empresa: Empresa;

  @OneToMany(() => Prestamo, (prestamo) => prestamo.empleado)
  prestamos: Prestamo[];

  @CreateDateColumn()
  created_at: Date;
}
