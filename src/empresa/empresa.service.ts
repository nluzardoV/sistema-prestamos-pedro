import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private repo: Repository<Empresa>,
  ) {}

  async crear(data: Partial<Empresa>): Promise<Empresa> {
    const empresa = this.repo.create(data);
    return this.repo.save(empresa);
  }

  async listar(): Promise<Empresa[]> {
    return this.repo.find({ relations: ['empleados'] });
  }

  async buscarPorId(id: number): Promise<Empresa> {
    const empresa = await this.repo.findOne({
      where: { id },
      relations: ['empleados'],
    });
    if (!empresa) throw new NotFoundException(`Empresa #${id} no encontrada`);
    return empresa;
  }

  async actualizar(id: number, data: Partial<Empresa>): Promise<Empresa> {
    await this.buscarPorId(id);
    await this.repo.update(id, data);
    return this.buscarPorId(id);
  }
}
