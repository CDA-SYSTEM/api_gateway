import { Controller, Post, Get, Patch, Delete, Body, Query, Param, UseGuards, ValidationPipe, UsePipes, Req, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiSecurity, ApiBearerAuth } from '@nestjs/swagger';
import { AuthApplicationService } from './application/auth.service';
import { LoginDto } from './application/dtos/login.dto';
import { RegisterDto } from './application/dtos/register.dto';
import { RegisterPersonnelDto } from './application/dtos/register-personnel.dto';
import { UpdateUserDto } from './application/dtos/update-user.dto';
import { ValidateTokenDto } from './application/dtos/validate-token.dto';
import { RefreshTokenDto } from './application/dtos/refresh-token.dto';
import { LogoutDto } from './application/dtos/logout.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as RoleConst } from '../common/constants/roles.constant';

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiSecurity('x-api-key')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthApplicationService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Roles(RoleConst.ADMIN, RoleConst.MANAGER)
  @Post('admin/personnel/register')
  @ApiOperation({ summary: 'Registro de personal (admin/manager)' })
  @ApiBody({ type: RegisterPersonnelDto })
  @ApiResponse({ status: 201, description: 'Personal registrado' })
  async registerPersonnel(@Body() body: RegisterPersonnelDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.registerPersonnel(body, token);
  }

  @Roles(RoleConst.ADMIN, RoleConst.MANAGER)
  @Get('users')
  @ApiOperation({ summary: 'Listar usuarios por rol' })
  @ApiQuery({ name: 'role', required: true, description: 'Rol del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async getUsers(@Query('role') role: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.getUsers(role, token);
  }

  @Roles(RoleConst.ADMIN, RoleConst.MANAGER)
  @Get('users/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  async getUserById(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.getUserById(id, token);
  }

  @Roles(RoleConst.ADMIN)
  @Patch('users/:id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.updateUser(id, body, token);
  }

  @Public()
  @Post('validate-token')
  @ApiOperation({ summary: 'Validar token JWT' })
  @ApiBody({ type: ValidateTokenDto })
  @ApiResponse({ status: 200, description: 'Token válido' })
  async validateToken(@Body() body: ValidateTokenDto) {
    return this.authService.validateToken(body.token);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Nuevos tokens generados' })
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Roles(RoleConst.ADMIN, RoleConst.MANAGER)
  @Get('users/search')
  @ApiOperation({ summary: 'Buscar usuarios' })
  @ApiQuery({ name: 'q', required: true, description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda' })
  async searchUsers(@Query('q') query: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.searchUsers(query, token);
  }

  @Roles(RoleConst.ADMIN, RoleConst.MANAGER, RoleConst.INSPECTOR, RoleConst.OPERARIO)
  @Get('modules/:module*')
  @ApiOperation({ summary: 'Verificar acceso a módulo (soporta sub-rutas)' })
  @ApiQuery({ name: 'module', required: true, description: 'Ruta del módulo (ej: ntc-5375/checklists)' })
  @ApiResponse({ status: 200, description: 'Acceso verificado' })
  async checkModuleAccess(@Param() params: Record<string, string>, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    const modulePath = params['0'] ? `${params['module']}${params['0']}` : params['module'];
    return this.authService.checkModuleAccess(modulePath, token);
  }

  @Roles(RoleConst.ADMIN, RoleConst.MANAGER)
  @Patch('users/:id/inactivate')
  @ApiOperation({ summary: 'Inactivar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario inactivado' })
  async inactivateUser(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.inactivateUser(id, token);
  }

  @Roles(RoleConst.ADMIN)
  @Delete('users/:id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.deleteUser(id, token);
  }

  @Roles(RoleConst.ADMIN, RoleConst.MANAGER)
  @Get('users/inspectors')
  @ApiOperation({ summary: 'Listar inspectores para dropdown' })
  @ApiResponse({ status: 200, description: 'Lista de inspectores' })
  async getInspectors(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.getInspectors(token);
  }

  @Roles(RoleConst.ADMIN, RoleConst.MANAGER)
  @Get('users/operarios')
  @ApiOperation({ summary: 'Listar operarios para dropdown' })
  @ApiResponse({ status: 200, description: 'Lista de operarios' })
  async getOperarios(@Req() req: Request) {
    const token = (req.headers['authorization'] as string)?.replace('Bearer ', '') ?? '';
    return this.authService.getOperarios(token);
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout de usuario' })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  async logout(@Body() body: LogoutDto) {
    return this.authService.logout(body.refreshToken);
  }
}
