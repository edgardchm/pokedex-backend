// Importaciones de NestJS para servicios y manejo de errores
import { Injectable, ConflictException } from '@nestjs/common';
// Importaciones de TypeORM para trabajar con la base de datos
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Importaciones de entidades y DTOs
import { Type } from '../entities/type.entity';
import { CreateTypeDto } from './dto/create-type.dto';

/**
 * Servicio que contiene la lógica de negocio para gestionar Tipos de Pokémon
 * Se encarga de las operaciones CRUD y la normalización de nombres de tipos
 */
@Injectable()  // Marca la clase como un servicio inyectable de NestJS
export class TypeService {
  constructor(
    // Inyecta el repositorio de Type para operaciones de base de datos
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
  ) {}

  /**
   * Obtiene todos los tipos de Pokémon de la base de datos
   * @returns Promise<Type[]> - Array con todos los tipos disponibles
   */
  async findAll(): Promise<Type[]> {
    // find() busca todos los registros de la tabla 'types'
    return this.typeRepository.find();
  }

  /**
   * Busca un tipo específico por su ID
   * @param id - ID numérico del tipo a buscar
   * @returns Promise<Type> - El tipo encontrado o null si no existe
   */
  async findOne(id: number): Promise<Type> {
    // findOne busca un registro que coincida con el ID
    return this.typeRepository.findOne({ where: { id } });
  }

  /**
   * Crea un nuevo tipo de Pokémon en la base de datos
   * Valida que el tipo no exista previamente (los nombres son únicos)
   * Normaliza el nombre a minúsculas para evitar duplicados (ej: "Fire" y "fire")
   * @param createTypeDto - Datos del tipo a crear (solo requiere el nombre)
   * @returns Promise<Type> - El tipo creado con su ID asignado
   * @throws ConflictException si el tipo ya existe en la base de datos
   */
  async create(createTypeDto: CreateTypeDto): Promise<Type> {
    // Buscar si ya existe un tipo con el mismo nombre (normalizado a minúsculas)
    const existingType = await this.typeRepository.findOne({
      where: { name: createTypeDto.name.toLowerCase() },
    });

    // Validar que el tipo no exista previamente
    if (existingType) {
      throw new ConflictException(
        `El tipo '${createTypeDto.name}' ya existe`,
      );
    }

    // Crear una instancia del tipo (aún no guardado en BD)
    // Normalizar el nombre a minúsculas para mantener consistencia
    const type = this.typeRepository.create({
      name: createTypeDto.name.toLowerCase(),
    });

    // Guardar el tipo en la base de datos
    return this.typeRepository.save(type);
  }

  /**
   * Busca un tipo por nombre o lo crea si no existe
   * Este método es útil cuando se crean Pokémon y se necesita asociar tipos
   * que pueden o no existir previamente
   * @param typeName - Nombre del tipo a buscar o crear
   * @returns Promise<Type> - El tipo encontrado o recién creado
   */
  async findOrCreate(typeName: string): Promise<Type> {
    // Normalizar el nombre a minúsculas para la búsqueda
    const normalizedName = typeName.toLowerCase();
    
    // Intentar encontrar el tipo existente
    let type = await this.typeRepository.findOne({
      where: { name: normalizedName },
    });

    // Si no existe, crearlo
    if (!type) {
      type = this.typeRepository.create({ name: normalizedName });
      type = await this.typeRepository.save(type);
    }

    // Retornar el tipo (existente o recién creado)
    return type;
  }
}

