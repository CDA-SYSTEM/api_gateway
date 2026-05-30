import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class OAuthGoogleDto {
  @ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIs...', description: 'ID token de Google (Google Sign-In)' })
  @IsString()
  @IsNotEmpty()
  id_token: string;
}
