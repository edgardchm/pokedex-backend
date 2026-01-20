// Importaciones de class-validator para validar los datos de entrada
import { IsString } from 'class-validator';
// Importaciones de Swagger para documentar la API
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO (Data Transfer Object) para crear un nuevo Tipo de Pokémon
 * Define la estructura y validaciones de los datos requeridos para crear un tipo
 * Solo requiere el nombre del tipo (ej: "fire", "water", "electric")
 */
export class CreateTypeDto {
  /**
   * Nombre del tipo de Pokémon
   * Debe ser una cadena de texto
   * El servicio normalizará el nombre a minúsculas automáticamente
   * Ejemplos: "fire", "water", "electric", "grass", "psychic"
   */
  @ApiProperty({ description: 'Nombre del tipo', example: 'electric' })
  @IsString()  // Valida que sea una cadena de texto
  name: string;
}

