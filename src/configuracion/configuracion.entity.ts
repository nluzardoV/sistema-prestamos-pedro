import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Configuracion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  clave: string;

  @Column()
  valor: string;
}
