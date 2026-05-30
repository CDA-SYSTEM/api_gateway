import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class OAuthGoogleDto {
  @ApiProperty({ example: '4/0Aean...', description: 'Authorization code de Google' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'postmessage', description: 'Redirect URI configurada en Google Cloud' })
  @IsString()
  @IsNotEmpty()
  redirectUri: string;
}
