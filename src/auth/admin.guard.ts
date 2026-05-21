import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { RolUsuario } from './auth.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user?.rol !== RolUsuario.ADMIN) {
      throw new ForbiddenException('Solo administradores pueden realizar esta acción');
    }
    return true;
  }
}
