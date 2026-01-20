// Importaciones de class-validator para validar los datos de entrada
import { IsString, IsNumber, IsArray, IsOptional, IsUrl } from 'class-validator';
// Importaciones de Swagger para documentar la API
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) para crear un nuevo Pokémon
 * Define la estructura y validaciones de los datos requeridos para crear un Pokémon
 * Todos los campos básicos son obligatorios, los tipos son opcionales
 */
export class CreatePokemonDto {
  /**
   * Nombre del Pokémon
   * Debe ser una cadena de texto
   */
  @ApiProperty({ description: 'Nombre del Pokémon', example: 'Pikachu' })
  @IsString()  // Valida que sea una cadena de texto
  name: string;

  /**
   * Altura del Pokémon en decímetros (1 decímetro = 10 cm)
   * Ejemplo: 4 = 40 cm
   */
  @ApiProperty({ description: 'Altura del Pokémon en decímetros', example: 4 })
  @IsNumber()  // Valida que sea un número
  height: number;

  /**
   * Peso del Pokémon en hectogramos (1 hectogramo = 100 gramos)
   * Ejemplo: 60 = 6 kg
   */
  @ApiProperty({ description: 'Peso del Pokémon en hectogramos', example: 60 })
  @IsNumber()
  weight: number;

  /**
   * Experiencia base que otorga el Pokémon al ser derrotado
   * Usado en los cálculos de experiencia del juego
   */
  @ApiProperty({ description: 'Experiencia base del Pokémon', example: 112 })
  @IsNumber()
  base_experience: number;

  /**
   * URL de la imagen (sprite) del Pokémon
   * Debe ser una URL válida
   */
  @ApiProperty({ description: 'URL del sprite del Pokémon', example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' })
  @IsUrl()  // Valida que sea una URL válida
  sprite_url: string;

  /**
   * IDs de los tipos existentes a asociar con el Pokémon
   * Opcional: puedes usar typeIds o typeNames, o ambos
   * Si se usan ambos, se combinan sin duplicados
   */
  @ApiPropertyOptional({ description: 'IDs de los tipos del Pokémon', type: [Number], example: [13, 10] })
  @IsArray()  // Valida que sea un array
  @IsOptional()  // El campo es opcional
  typeIds?: number[];

  /**
   * Nombres de los tipos a asociar con el Pokémon
   * Si el tipo no existe, se crea automáticamente
   * Opcional: puedes usar typeIds o typeNames, o ambos
   */
  @ApiPropertyOptional({ description: 'Nombres de los tipos del Pokémon', type: [String], example: ['electric'] })
  @IsArray()
  @IsString({ each: true })  // Valida que cada elemento del array sea una cadena
  @IsOptional()
  typeNames?: string[];
}

