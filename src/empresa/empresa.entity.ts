import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Empleado } from '../empleado/empleado.entity';

@Entity()
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  rif: string;

  @Column({ nullable: true })
  contacto_nombre: string;

  @Column({ nullable: true })
  contacto_telefono: string;

  @Column({ default: true })
  activa: boolean;

  @OneToMany(() => Empleado, (empleado) => empleado.empresa)
  empleados: Empleado[];

  @CreateDateColumn()
  created_at: Date;
}
