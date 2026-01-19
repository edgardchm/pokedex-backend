import { IsString, IsNumber, IsArray, IsOptional, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePokemonDto {
  @ApiPropertyOptional({ description: 'Nombre del Pokémon', example: 'Pikachu' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Altura del Pokémon en decímetros', example: 4 })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ description: 'Peso del Pokémon en hectogramos', example: 60 })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Experiencia base del Pokémon', example: 112 })
  @IsNumber()
  @IsOptional()
  base_experience?: number;

  @ApiPropertyOptional({ description: 'URL del sprite del Pokémon', example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' })
  @IsUrl()
  @IsOptional()
  sprite_url?: string;

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

