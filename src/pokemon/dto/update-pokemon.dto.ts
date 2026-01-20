// Importaciones de class-validator para validar los datos de entrada
import { IsString, IsNumber, IsArray, IsOptional, IsUrl } from 'class-validator';
// Importaciones de Swagger para documentar la API
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) para actualizar un Pokémon existente
 * Todos los campos son opcionales, permitiendo actualizaciones parciales
 * Solo se actualizarán los campos que se proporcionen en la petición
 */
export class UpdatePokemonDto {
  /**
   * Nuevo nombre del Pokémon (opcional)
   */
  @ApiPropertyOptional({ description: 'Nombre del Pokémon', example: 'Pikachu' })
  @IsString()
  @IsOptional()  // Campo opcional para actualizaciones parciales
  name?: string;

  /**
   * Nueva altura del Pokémon en decímetros (opcional)
   */
  @ApiPropertyOptional({ description: 'Altura del Pokémon en decímetros', example: 4 })
  @IsNumber()
  @IsOptional()
  height?: number;

  /**
   * Nuevo peso del Pokémon en hectogramos (opcional)
   */
  @ApiPropertyOptional({ description: 'Peso del Pokémon en hectogramos', example: 60 })
  @IsNumber()
  @IsOptional()
  weight?: number;

  /**
   * Nueva experiencia base del Pokémon (opcional)
   */
  @ApiPropertyOptional({ description: 'Experiencia base del Pokémon', example: 112 })
  @IsNumber()
  @IsOptional()
  base_experience?: number;

  /**
   * Nueva URL del sprite del Pokémon (opcional)
   */
  @ApiPropertyOptional({ description: 'URL del sprite del Pokémon', example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' })
  @IsUrl()
  @IsOptional()
  sprite_url?: string;

  /**
   * IDs de los tipos a asociar con el Pokémon (opcional)
   * Si se proporciona, reemplazará los tipos actuales
   */
  @ApiPropertyOptional({ description: 'IDs de los tipos del Pokémon', type: [Number], example: [13, 10] })
  @IsArray()
  @IsOptional()
  typeIds?: number[];

  /**
   * Nombres de los tipos a asociar con el Pokémon (opcional)
   * Si se proporciona, reemplazará los tipos actuales
   * Los tipos se crearán automáticamente si no existen
   */
  @ApiPropertyOptional({ description: 'Nombres de los tipos del Pokémon', type: [String], example: ['electric'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  typeNames?: string[];
}

