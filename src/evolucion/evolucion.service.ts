import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from '../entities/pokemon.entity';

/**
 * Interfaz para representar un nodo en el árbol evolutivo
 */
export interface EvolutionNode {
  id: number;
  name: string;
  pokedex_number: number;
  sprite_url: string;
  types: Array<{ id: number; name: string }>;
  evolutions: EvolutionNode[];
}

/**
 * Servicio que maneja la lógica de evolución de Pokémon
 * Permite obtener cadenas y árboles evolutivos completos
 */
@Injectable()
export class EvolucionService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
  ) {}

  /**
   * Obtiene la cadena evolutiva completa de un Pokémon
   * @param pokemonId - ID del Pokémon para obtener su cadena evolutiva
   * @returns Promise<EvolutionNode> - Árbol evolutivo completo desde la forma base
   */
  async getEvolutionChain(pokemonId: number): Promise<EvolutionNode> {
    // Buscar el Pokémon
    const pokemon = await this.pokemonRepository.findOne({
      where: { id: pokemonId },
      relations: ['types'],
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon con ID ${pokemonId} no encontrado`);
    }

    // Obtener la forma base de la cadena evolutiva
    const baseForm = await this.getBaseForm(pokemon);

    // Construir el árbol evolutivo completo desde la base
    return this.buildEvolutionTree(baseForm);
  }

  /**
   * Obtiene todas las cadenas evolutivas disponibles
   * @returns Promise<EvolutionNode[]> - Array de árboles evolutivos
   */
  async getAllEvolutionChains(): Promise<EvolutionNode[]> {
    // Buscar todos los Pokémon que son formas base (no evolucionan de nadie)
    const baseForms = await this.pokemonRepository.find({
      where: { evolves_from_id: null },
      relations: ['types'],
      order: { pokedex_number: 'ASC' },
    });

    // Construir el árbol evolutivo para cada forma base
    const evolutionChains = await Promise.all(
      baseForms.map((pokemon) => this.buildEvolutionTree(pokemon)),
    );

    return evolutionChains;
  }

  /**
   * Obtiene la forma base de un Pokémon (primer Pokémon en la cadena evolutiva)
   * @param pokemon - Pokémon del cual obtener la forma base
   * @returns Promise<Pokemon> - Forma base del Pokémon
   */
  private async getBaseForm(pokemon: Pokemon): Promise<Pokemon> {
    let current = pokemon;

    // Recorrer hacia atrás la cadena evolutiva hasta encontrar la forma base
    while (current.evolves_from_id) {
      const previous = await this.pokemonRepository.findOne({
        where: { id: current.evolves_from_id },
        relations: ['types'],
      });

      if (!previous) break;
      current = previous;
    }

    return current;
  }

  /**
   * Construye recursivamente el árbol evolutivo completo
   * @param pokemon - Pokémon raíz para construir el árbol
   * @returns Promise<EvolutionNode> - Nodo del árbol con todas sus evoluciones
   */
  private async buildEvolutionTree(pokemon: Pokemon): Promise<EvolutionNode> {
    // Buscar todas las evoluciones directas de este Pokémon
    const evolutions = await this.pokemonRepository.find({
      where: { evolves_from_id: pokemon.id },
      relations: ['types'],
      order: { pokedex_number: 'ASC' },
    });

    // Construir recursivamente el árbol para cada evolución
    const evolutionNodes = await Promise.all(
      evolutions.map((evo) => this.buildEvolutionTree(evo)),
    );

    // Crear el nodo del árbol evolutivo
    return {
      id: pokemon.id,
      name: pokemon.name,
      pokedex_number: pokemon.pokedex_number,
      sprite_url: pokemon.sprite_url,
      types: pokemon.types.map((type) => ({
        id: type.id,
        name: type.name,
      })),
      evolutions: evolutionNodes,
    };
  }

  /**
   * Establece la relación de evolución entre dos Pokémon
   * @param pokemonId - ID del Pokémon que evoluciona
   * @param evolvesFromId - ID del Pokémon del cual evoluciona (null para forma base)
   * @returns Promise<Pokemon> - Pokémon actualizado
   */
  async setEvolution(pokemonId: number, evolvesFromId: number | null): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id: pokemonId },
      relations: ['types'],
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon con ID ${pokemonId} no encontrado`);
    }

    if (evolvesFromId !== null) {
      const evolvesFrom = await this.pokemonRepository.findOne({
        where: { id: evolvesFromId },
      });

      if (!evolvesFrom) {
        throw new NotFoundException(`Pokemon con ID ${evolvesFromId} no encontrado`);
      }
    }

    pokemon.evolves_from_id = evolvesFromId;
    return this.pokemonRepository.save(pokemon);
  }

  /**
   * Elimina la relación de evolución de un Pokémon específico
   * @param pokemonId - ID del Pokémon al que se le limpiará la evolución
   * @returns Promise<void>
   */
  async clearEvolution(pokemonId: number): Promise<void> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id: pokemonId },
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon con ID ${pokemonId} no encontrado`);
    }

    pokemon.evolves_from_id = null;
    await this.pokemonRepository.save(pokemon);
  }
}
