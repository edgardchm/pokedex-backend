import { IsString, IsNumber, IsArray, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePokemonDto {
  @ApiProperty({ description: 'Nombre del Pokémon', example: 'Pikachu' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Altura del Pokémon en decímetros', example: 4 })
  @IsNumber()
  height: number;

  @ApiProperty({ description: 'Peso del Pokémon en hectogramos', example: 60 })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'Experiencia base del Pokémon', example: 112 })
  @IsNumber()
  base_experience: number;

  @ApiProperty({ description: 'URL del sprite del Pokémon', example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' })
  @IsUrl()
  sprite_url: string;

  @ApiPropertyOptional({ description: 'IDs de los tipos del Pokémon', type: [Number], example: [13, 10] })
  @IsArray()
  @IsOptional()
  typeIds?: number[];

  @ApiPropertyOptional({ description: 'Nombres de los tipos del Pokémon', type: [String], example: ['electric'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  typeNames?: string[];
}

