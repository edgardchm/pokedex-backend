import { Controller, Get, Param, ParseIntPipe, Post, Body, Patch, Delete } from '@nestjs/common';
import { EvolucionService, EvolutionNode } from './evolucion.service';
import { SetEvolutionDto } from './dto/set-evolution.dto';
import { Pokemon } from '../entities/pokemon.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Controlador REST para gestionar las evoluciones de Pokémon
 * Define los endpoints para obtener cadenas evolutivas
 */
@ApiTags('evolution')  // Agrupa todos los endpoints bajo la etiqueta 'evolution' en Swagger
@Controller('evolution')
export class EvolucionController {
  constructor(private readonly evolucionService: EvolucionService) {}

  /**
   * GET /evolution
   * Obtiene todas las cadenas evolutivas disponibles
   * @returns Promise<EvolutionNode[]> - Array de árboles evolutivos
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todas las cadenas evolutivas' })  // Descripción en Swagger
  async getAllEvolutionChains(): Promise<EvolutionNode[]> {
    return this.evolucionService.getAllEvolutionChains();
  }

  /**
   * GET /evolution/:id
   * Obtiene la cadena evolutiva de un Pokémon específico
   * @param id - ID del Pokémon
   * @returns Promise<EvolutionNode> - Árbol evolutivo completo
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener la cadena evolutiva de un Pokémon' })  // Descripción en Swagger
  async getEvolutionChain(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EvolutionNode> {
    return this.evolucionService.getEvolutionChain(id);
  }

  /**
   * PATCH /evolution/set
   * Establece la relación de evolución entre dos Pokémon
   * @param setEvolutionDto - Datos de la evolución
   * @returns Promise<Pokemon> - Pokémon actualizado
   */
  @Patch('set')
  @ApiOperation({ summary: 'Establecer la relación de evolución entre dos Pokémon' })  // Descripción en Swagger
  async setEvolution(@Body() setEvolutionDto: SetEvolutionDto): Promise<Pokemon> {
    return this.evolucionService.setEvolution(
      setEvolutionDto.pokemonId,
      setEvolutionDto.evolvesFromId,
    );
  }

  @Delete('clear/:id')
  @ApiOperation({ summary: 'Limpiar la relación de evolución de un Pokémon por ID' })  // Descripción en Swagger
  async clearEvolution(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.evolucionService.clearEvolution(id);
  }
}
