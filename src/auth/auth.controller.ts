import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RolUsuario } from './auth.entity';
import { AdminGuard } from './admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post('registro')
  registrar(
    @Body()
    body: {
      username: string;
      password: string;
      rol?: RolUsuario;
      empleadoId?: number;
    },
  ) {
    return this.authService.registrar(
      body.username,
      body.password,
      body.rol,
      body.empleadoId,
    );
  }

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('perfil')
  perfil(@Request() req: { user: { sub: number } }) {
    return this.authService.perfil(req.user.sub);
  }
}
