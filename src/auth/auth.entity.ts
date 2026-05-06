import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum RolUsuario {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', default: RolUsuario.CLIENT })
  rol: RolUsuario;

  @Column({ type: 'int', nullable: true })
  empleado_id: number | null;

  @CreateDateColumn()
  created_at: Date;
}
