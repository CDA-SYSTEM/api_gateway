import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CacheResponseDto {
  @ApiProperty({ example: 'vehicles:list:active' })
  key: string;

  @ApiPropertyOptional()
  value?: any;

  @ApiPropertyOptional({ example: 60 })
  ttlSeconds?: number;
}
