import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeDto {
  @ApiProperty({ description: 'Nombre del tipo', example: 'electric' })
  @IsString()
  name: string;
}

