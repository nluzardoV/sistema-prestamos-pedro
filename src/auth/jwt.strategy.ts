import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './auth.entity';

// Definimos la estructura esperada del token para Typescript
interface JwtPayload {
  sub: number;
  username: string;
  rol: string;
  empleado_id: number | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secreto_prestamos_2026',
    });
  }

  // Quitamos async porque no tiene ningún await dentro, y quitamos 'any' definiendo la interfaz
  async validate(payload: JwtPayload) {
    const usuario = await this.usuarioRepo.findOne({ where: { id: payload.sub } });
    if (!usuario) {
      throw new UnauthorizedException('Token inválido o usuario eliminado');
    }
    return {
      sub: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      empleado_id: usuario.empleado_id,
    };
  }
}
