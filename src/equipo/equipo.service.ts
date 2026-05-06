import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './equipo.entity';

@Injectable()
export class EquipoService {
  constructor(
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
  ) {}

  async findAll(): Promise<Equipo[]> {
    return this.equipoRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Equipo> {
    const equipo = await this.equipoRepository.findOne({ where: { id } });
    if (!equipo) throw new NotFoundException('Equipo no encontrado');
    return equipo;
  }

  async create(data: Partial<Equipo>): Promise<Equipo> {
    const nuevo = this.equipoRepository.create(data);
    return this.equipoRepository.save(nuevo);
  }

  async update(id: number, data: Partial<Equipo>): Promise<Equipo> {
    await this.findOne(id);
    await this.equipoRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const equipo = await this.findOne(id);
    await this.equipoRepository.remove(equipo);
  }
}
