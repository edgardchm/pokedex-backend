import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para establecer la relación de evolución entre Pokémon
 */
export class SetEvolutionDto {
  /**
   * ID del Pokémon que evoluciona (forma evolucionada)
   */
  @ApiProperty({ 
    description: 'ID del Pokémon que evoluciona', 
    example: 2 
  })
  @IsNumber()
  pokemonId: number;

  /**
   * ID del Pokémon previo (del cual evoluciona)
   */
  @ApiProperty({ 
    description: 'ID del Pokémon del cual evoluciona (null para forma base)', 
    example: 1,
    required: false
  })
  @IsNumber()
  evolvesFromId: number | null;
}
