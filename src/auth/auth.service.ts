import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario, RolUsuario } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async registrar(
    username: string,
    password: string,
    rol: RolUsuario = RolUsuario.CLIENT,
    empleadoId?: number,
  ) {
    const existe = await this.usuarioRepo.findOne({ where: { username } });
    if (existe) throw new ConflictException('El usuario ya existe');

    const hash = await bcrypt.hash(password, 10);
    const usuario = this.usuarioRepo.create({
      username,
      password: hash,
      rol,
      empleado_id: empleadoId ?? null,
    });
    await this.usuarioRepo.save(usuario);
    return { mensaje: '✅ Usuario creado exitosamente' };
  }

  async login(username: string, password: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { username } });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      empleado_id: usuario.empleado_id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      rol: usuario.rol,
      username: usuario.username,
    };
  }

  async perfil(userId: number) {
    return this.usuarioRepo.findOne({ where: { id: userId } });
  }
  async crearAdminInicial(): Promise<void> {
  const existe = await this.usuarioRepo.findOne({ where: { username: 'irma' } });
  if (!existe) {
    const hash = await bcrypt.hash('admin123', 10);
    await this.usuarioRepo.save({
      username: 'irma',
      password: hash,
      rol: RolUsuario.ADMIN,
      empleado_id: null,
    });
    console.log('✅ Usuario admin creado automáticamente');
  }
}
}
