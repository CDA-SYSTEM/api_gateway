import { OmitType } from '@nestjs/swagger';
import { CreateLabradoDto } from './create-labrado.dto';

export class UpdateLabradoDto extends OmitType(CreateLabradoDto, ['inspection_id'] as const) {}
