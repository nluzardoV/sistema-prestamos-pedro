import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum TipoTasa {
  BCV = 'BCV',
  PARALELO = 'PARALELO',
  BINANCE = 'BINANCE',
}

@Entity()
export class Tasa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  tipo: TipoTasa;

  @Column('decimal', { precision: 12, scale: 4 })
  valor: number;

  @UpdateDateColumn()
  updated_at: Date;
}
