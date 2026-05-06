import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './empleado.entity';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private repo: Repository<Empleado>,
  ) {}

  async crear(data: Partial<Empleado>): Promise<Empleado> {
    const empleado = this.repo.create(data);
    return this.repo.save(empleado);
  }

  async listar(): Promise<Empleado[]> {
    return this.repo.find({ relations: ['empresa', 'prestamos'] });
  }

  async buscarPorId(id: number): Promise<Empleado> {
    const empleado = await this.repo.findOne({
      where: { id },
      relations: ['empresa', 'prestamos'],
    });
    if (!empleado) throw new NotFoundException(`Empleado #${id} no encontrado`);
    return empleado;
  }

  async actualizar(id: number, data: Partial<Empleado>): Promise<Empleado> {
    await this.buscarPorId(id);
    await this.repo.update(id, data);
    return this.buscarPorId(id);
  }

  calcularAntiguedadMeses(fecha_ingreso: string): number {
    const inicio = new Date(fecha_ingreso);
    const hoy = new Date();
    return (
      (hoy.getFullYear() - inicio.getFullYear()) * 12 +
      (hoy.getMonth() - inicio.getMonth())
    );
  }

 async eliminar(id: number): Promise<void> {
  await this.repo.query(`DELETE FROM pago_cuota WHERE prestamoId IN (SELECT id FROM prestamo WHERE empleadoId = ${id})`);
  await this.repo.query(`DELETE FROM prestamo WHERE empleadoId = ${id}`);
  await this.repo.query(`DELETE FROM usuario WHERE empleado_id = ${id}`);
  await this.repo.query(`DELETE FROM empleado WHERE id = ${id}`);
}
}
