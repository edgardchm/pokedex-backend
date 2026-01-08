import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Pokemon } from '../entities/pokemon.entity';
import { Type } from '../entities/type.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { TypeService } from '../type/type.service';
import { PokemonGateway } from './pokemon.gateway';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private pokemonRepository: Repository<Pokemon>,
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
    private typeService: TypeService,
    @Inject(forwardRef(() => PokemonGateway))
    private pokemonGateway: PokemonGateway,
  ) {}

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonRepository.find({
      relations: ['types'],
    });
  }

  async findOne(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: ['types'],
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon con ID ${id} no encontrado`);
    }

    return pokemon;
  }

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const { typeIds, typeNames, ...pokemonData } = createPokemonDto;

    const pokemon = this.pokemonRepository.create(pokemonData);
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

    pokemon.types = types;
    const savedPokemon = await this.pokemonRepository.save(pokemon);
    
    // Emitir evento WebSocket cuando se crea un nuevo Pokémon
    this.pokemonGateway.emitPokemonCreated(savedPokemon);
    
    return savedPokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
    // Buscar el Pokémon existente
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
      relations: ['types'],
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon con ID ${id} no encontrado`);
    }

    // Actualizar campos básicos si se proporcionan
    const { typeIds, typeNames, ...pokemonData } = updatePokemonDto;
    
    if (Object.keys(pokemonData).length > 0) {
      Object.assign(pokemon, pokemonData);
    }

    // Manejar actualización de tipos
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

      pokemon.types = types;
    }

    const updatedPokemon = await this.pokemonRepository.save(pokemon);
    
    // Emitir evento WebSocket cuando se actualiza un Pokémon
    this.pokemonGateway.emitPokemonUpdated(updatedPokemon);
    
    return updatedPokemon;
  }

  async remove(id: number): Promise<void> {
    const pokemon = await this.pokemonRepository.findOne({
      where: { id },
    });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon con ID ${id} no encontrado`);
    }

    await this.pokemonRepository.remove(pokemon);
    
    // Emitir evento WebSocket cuando se elimina un Pokémon
    this.pokemonGateway.emitPokemonDeleted(id);
  }
}

