// Importaciones de NestJS para servicios y manejo de errores
import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
// Importaciones de TypeORM para trabajar con la base de datos
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
// Importaciones de entidades y DTOs
import { Pokemon } from '../entities/pokemon.entity';
import { Type } from '../entities/type.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { TypeService } from '../type/type.service';
import { PokemonGateway } from './pokemon.gateway';

/**
 * Servicio que contiene la lógica de negocio para gestionar Pokémon
 * Se encarga de todas las operaciones CRUD y la comunicación con la base de datos
 */
@Injectable()  // Marca la clase como un servicio inyectable de NestJS
export class PokemonService {
  constructor(
    // Inyecta el repositorio de Pokemon para operaciones de base de datos
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
    // Inyecta el repositorio de Type para buscar tipos existentes
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
    // Inyecta el servicio de tipos para crear o buscar tipos
    private typeService: TypeService,
    // Inyecta el gateway de WebSocket con forwardRef para evitar dependencias circulares
    // forwardRef es necesario porque PokemonGateway también puede depender de PokemonService
    @Inject(forwardRef(() => PokemonGateway))
    private pokemonGateway: PokemonGateway,
  ) {}

  /**
   * Obtiene todos los Pokémon de la base de datos
   * Incluye la relación con los tipos (types) para evitar consultas adicionales
   * @returns Promise<Pokemon[]> - Array con todos los Pokémon y sus tipos
   */
  async findAll(): Promise<Pokemon[]> {
    // find() busca todos los registros
    // relations: ['types'] carga automáticamente los tipos relacionados (JOIN)
    return this.pokemonRepository.find({
      relations: ['types'],
    });
  }

  /**
   * Busca un Pokémon específico por su ID
   * @param id - ID numérico del Pokémon a buscar
   * @returns Promise<Pokemon> - El Pokémon encontrado con sus tipos
   * @throws NotFoundException si no se encuentra el Pokémon
   */
  async findOne(id: number): Promise<Pokemon> {
    // findOne busca un registro que coincida con los criterios
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },  // Condición: buscar por ID
      relations: ['types'],  // Cargar tipos relacionados
    });

    // Validar que el Pokémon existe
    if (!pokemon) {
      throw new NotFoundException(`Pokemon con ID ${id} no encontrado`);
    }

    return pokemon;
  }

  /**
   * Crea un nuevo Pokémon en la base de datos
   * Maneja la creación o asociación de tipos mediante nombres o IDs
   * @param createPokemonDto - Datos del Pokémon a crear
   * @returns Promise<Pokemon> - El Pokémon creado con su ID y tipos asignados
   */
  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    // Desestructuración: separa los campos de tipos del resto de datos del Pokémon
    const { typeIds, typeNames, ...pokemonData } = createPokemonDto;

    // Crea una instancia del Pokémon (aún no guardado en BD)
    const pokemon = this.pokemonRepository.create(pokemonData);
    const types: Type[] = [];  // Array para almacenar los tipos asociados

    // Si se proporcionan nombres de tipos, crearlos o buscarlos
    // Esto permite crear tipos nuevos automáticamente si no existen
    if (typeNames && typeNames.length > 0) {
      for (const typeName of typeNames) {
        // findOrCreate busca el tipo o lo crea si no existe
        const type = await this.typeService.findOrCreate(typeName);
        types.push(type);
      }
    }

    // Si se proporcionan IDs de tipos, buscarlos en la base de datos
    if (typeIds && typeIds.length > 0) {
      // In() permite buscar múltiples IDs en una sola consulta
      const typesById = await this.typeRepository.findBy({
        id: In(typeIds),
      });
      // Combinar tipos sin duplicados (evita agregar el mismo tipo dos veces)
      typesById.forEach((type) => {
        if (!types.find((t) => t.id === type.id)) {
          types.push(type);
        }
      });
    }

    // Asignar los tipos al Pokémon
    pokemon.types = types;
    // Guardar el Pokémon en la base de datos (esto también guarda las relaciones)
    const savedPokemon = await this.pokemonRepository.save(pokemon);
    
    // Emitir evento WebSocket para notificar a los clientes conectados
    // que se ha creado un nuevo Pokémon (actualización en tiempo real)
    this.pokemonGateway.emitPokemonCreated(savedPokemon);
    
    return savedPokemon;
  }

  /**
   * Actualiza un Pokémon existente
   * Permite actualización parcial: solo se actualizan los campos proporcionados
   * @param id - ID del Pokémon a actualizar
   * @param updatePokemonDto - Datos a actualizar (todos los campos son opcionales)
   * @returns Promise<Pokemon> - El Pokémon actualizado
   * @throws NotFoundException si el Pokémon no existe
   */
  async update(id: number, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
    // Buscar el Pokémon existente con sus tipos actuales
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: ['types'],  // Cargar tipos para poder actualizarlos
    });

    // Validar que el Pokémon existe
    if (!pokemon) {
      throw new NotFoundException(`Pokemon con ID ${id} no encontrado`);
    }

    // Separar los campos de tipos del resto de datos
    const { typeIds, typeNames, ...pokemonData } = updatePokemonDto;
    
    // Actualizar campos básicos solo si se proporcionaron nuevos valores
    // Object.keys(pokemonData).length > 0 verifica que haya campos para actualizar
    if (Object.keys(pokemonData).length > 0) {
      // Object.assign copia las propiedades de pokemonData a pokemon
      Object.assign(pokemon, pokemonData);
    }

    // Manejar actualización de tipos (solo si se proporcionan)
    if (typeNames || typeIds) {
      const types: Type[] = [];

      // Si se proporcionan nombres de tipos, crearlos o buscarlos
      if (typeNames && typeNames.length > 0) {
        for (const typeName of typeNames) {
          const type = await this.typeService.findOrCreate(typeName);
          types.push(type);
        }
      }

      // Si se proporcionan IDs de tipos, buscarlos
      if (typeIds && typeIds.length > 0) {
        const typesById = await this.typeRepository.findBy({
          id: In(typeIds),
        });
        // Combinar tipos sin duplicados
        typesById.forEach((type) => {
          if (!types.find((t) => t.id === type.id)) {
            types.push(type);
          }
        });
      }

      // Reemplazar los tipos del Pokémon con los nuevos
      pokemon.types = types;
    }

    // Guardar los cambios en la base de datos
    const updatedPokemon = await this.pokemonRepository.save(pokemon);
    
    // Emitir evento WebSocket para notificar la actualización en tiempo real
    this.pokemonGateway.emitPokemonUpdated(updatedPokemon);
    
    return updatedPokemon;
  }

  /**
   * Elimina un Pokémon de la base de datos
   * TypeORM maneja automáticamente la eliminación de las relaciones en la tabla intermedia
   * @param id - ID del Pokémon a eliminar
   * @returns Promise<void> - No retorna contenido
   * @throws NotFoundException si el Pokémon no existe
   */
  async remove(id: number): Promise<void> {
    // Buscar el Pokémon antes de eliminarlo (para validar que existe)
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      // No necesitamos cargar relaciones para eliminar
    });

    // Validar que el Pokémon existe
    if (!pokemon) {
      throw new NotFoundException(`Pokemon con ID ${id} no encontrado`);
    }

    // Eliminar el Pokémon de la base de datos
    // remove() también elimina automáticamente las relaciones en la tabla pokemon_types
    await this.pokemonRepository.remove(pokemon);
    
    // Emitir evento WebSocket para notificar la eliminación en tiempo real
    // Se envía solo el ID porque el Pokémon ya no existe
    this.pokemonGateway.emitPokemonDeleted(id);
  }
}

