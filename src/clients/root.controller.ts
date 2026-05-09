import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('root')
@Controller()
export class RootController {
  @Get()
  @Public()
  @ApiOperation({ summary: 'Root - health check del gateway' })
  @ApiResponse({ status: 200, description: 'API Gateway running' })
  root() {
    return { message: 'Hello World - API Gateway' };
  }
}
