import { Controller, Post, Get, Patch, Delete, Body, Query, Param, UseGuards, ValidationPipe, UsePipes, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiHeader, ApiQuery, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { AuthApplicationService } from './application/auth.service';
import { LoginDto } from './application/dtos/login.dto';
import { RegisterDto } from './application/dtos/register.dto';
import { UpdateUserDto } from './application/dtos/update-user.dto';
import { ValidateTokenDto } from './application/dtos/validate-token.dto';
import { RefreshTokenDto } from './application/dtos/refresh-token.dto';
import { LogoutDto } from './application/dtos/logout.dto';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ApiKeyGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthApplicationService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de usuario (requiere token admin/manager)' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado' })
  async register(@Body() body: RegisterDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.register(body, token);
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar usuarios por rol' })
  @ApiQuery({ name: 'role', required: true, description: 'Rol del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async getUsers(@Query('role') role: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.getUsers(role, token);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  async getUserById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.getUserById(id, token);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.updateUser(id, body, token);
  }

  @Post('validate-token')
  @ApiOperation({ summary: 'Validar token JWT' })
  @ApiBody({ type: ValidateTokenDto })
  @ApiResponse({ status: 200, description: 'Token válido' })
  async validateToken(@Body() body: ValidateTokenDto) {
    return this.authService.validateToken(body.token);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Nuevos tokens generados' })
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Get('users/search')
  @ApiOperation({ summary: 'Buscar usuarios' })
  @ApiQuery({ name: 'q', required: true, description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
  async searchUsers(@Query('q') query: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.searchUsers(query, token);
  }

  @Get('modules/:module')
  @ApiOperation({ summary: 'Verificar acceso a módulo' })
  @ApiResponse({ status: 200, description: 'Acceso verificado' })
  async checkModuleAccess(@Param('module') module: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.checkModuleAccess(module, token);
  }

  @Patch('users/:id/inactivate')
  @ApiOperation({ summary: 'Inactivar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario inactivado' })
  async inactivateUser(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.inactivateUser(id, token);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.deleteUser(id, token);
  }

  @Get('users/inspectors')
  @ApiOperation({ summary: 'Listar inspectores para dropdown' })
  @ApiResponse({ status: 200, description: 'Lista de inspectores' })
  async getInspectors(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.getInspectors(token);
  }

  @Get('users/operarios')
  @ApiOperation({ summary: 'Listar operarios para dropdown' })
  @ApiResponse({ status: 200, description: 'Lista de operarios' })
  async getOperarios(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.getOperarios(token);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout de usuario' })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  async logout(@Body() body: LogoutDto) {
    return this.authService.logout(body.refreshToken);
  }
}
