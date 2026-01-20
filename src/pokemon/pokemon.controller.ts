// Importaciones de NestJS para crear controladores REST
import {
  Controller,      // Decorador para definir un controlador
  Get,            // Decorador para manejar peticiones GET
  Post,           // Decorador para manejar peticiones POST
  Put,            // Decorador para manejar peticiones PUT
  Delete,         // Decorador para manejar peticiones DELETE
  Body,           // Decorador para extraer el cuerpo de la petición
  Param,          // Decorador para extraer parámetros de la URL
  ParseIntPipe,   // Pipe para convertir parámetros a números enteros
  HttpCode,       // Decorador para especificar el código de estado HTTP
  HttpStatus,     // Enum con códigos de estado HTTP
} from '@nestjs/common';

// Importaciones de Swagger para documentar la API
import {
  ApiTags,        // Agrupa endpoints en Swagger UI
  ApiOperation,   // Describe la operación del endpoint
  ApiResponse,    // Documenta las respuestas posibles
  ApiParam,       // Documenta los parámetros de la URL
  ApiBody,        // Documenta el cuerpo de la petición
} from '@nestjs/swagger';

// Importaciones de servicios y DTOs del módulo Pokemon
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from '../entities/pokemon.entity';

/**
 * Controlador REST para gestionar operaciones CRUD de Pokémon
 * Todas las rutas están bajo el prefijo '/pokemon'
 */
@ApiTags('pokemon')  // Agrupa todos los endpoints bajo la etiqueta 'pokemon' en Swagger
@Controller('pokemon')  // Define la ruta base del controlador: /pokemon
export class PokemonController {
  // Inyección de dependencias: NestJS inyecta automáticamente el servicio
  constructor(private readonly pokemonService: PokemonService) { }

  /**
   * Endpoint GET /pokemon
   * Obtiene todos los Pokémon almacenados en la base de datos
   * @returns Promise<Pokemon[]> - Lista completa de Pokémon con sus tipos relacionados
   */
  @Get()  // Maneja peticiones GET a /pokemon
  @ApiOperation({ summary: 'Obtener todos los Pokémons' })  // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Lista de Pokémons obtenida exitosamente', type: [Pokemon] })
  @HttpCode(HttpStatus.OK)  // Establece el código de respuesta HTTP a 200
  async findAll(): Promise<Pokemon[]> {
    // Delega la lógica al servicio y retorna todos los Pokémon
    return this.pokemonService.findAll();
  }

  /**
   * Endpoint GET /pokemon/:id
   * Obtiene un Pokémon específico por su ID
   * @param id - ID numérico del Pokémon (convertido automáticamente por ParseIntPipe)
   * @returns Promise<Pokemon> - El Pokémon encontrado con sus tipos relacionados
   * @throws NotFoundException si el Pokémon no existe
   */
  @Get(':id')  // Maneja peticiones GET a /pokemon/:id
  @ApiOperation({ summary: 'Obtener un Pokémon por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Pokémon' })  // Documenta el parámetro en Swagger
  @ApiResponse({ status: 200, description: 'Pokémon encontrado', type: Pokemon })
  @ApiResponse({ status: 404, description: 'Pokémon no encontrado' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Pokemon> {
    // ParseIntPipe convierte el parámetro de string a número y valida que sea entero
    return this.pokemonService.findOne(id);
  }

  /**
   * Endpoint POST /pokemon
   * Crea un nuevo Pokémon en la base de datos
   * @param createPokemonDto - Datos del Pokémon a crear (validados automáticamente)
   * @returns Promise<Pokemon> - El Pokémon creado con su ID asignado
   * @throws BadRequestException si los datos son inválidos
   */
  @Post()  // Maneja peticiones POST a /pokemon
  @ApiOperation({ summary: 'Crear un nuevo Pokémon' })
  @ApiBody({ type: CreatePokemonDto })  // Documenta el formato del cuerpo en Swagger
  @ApiResponse({ status: 201, description: 'Pokémon creado exitosamente', type: Pokemon })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @HttpCode(HttpStatus.CREATED)  // Código 201 para recursos creados
  async create(@Body() createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    // @Body() extrae y valida el JSON del cuerpo de la petición según CreatePokemonDto
    return this.pokemonService.create(createPokemonDto);
  }

  /**
   * Endpoint PUT /pokemon/:id
   * Actualiza un Pokémon existente (actualización parcial o completa)
   * @param id - ID numérico del Pokémon a actualizar
   * @param updatePokemonDto - Datos a actualizar (todos los campos son opcionales)
   * @returns Promise<Pokemon> - El Pokémon actualizado
   * @throws NotFoundException si el Pokémon no existe
   */
  @Put(':id')  // Maneja peticiones PUT a /pokemon/:id
  @ApiOperation({ summary: 'Actualizar un Pokémon' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Pokémon' })
  @ApiBody({ type: UpdatePokemonDto })
  @ApiResponse({ status: 200, description: 'Pokémon actualizado exitosamente', type: Pokemon })
  @ApiResponse({ status: 404, description: 'Pokémon no encontrado' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,  // Extrae el ID de la URL
    @Body() updatePokemonDto: UpdatePokemonDto,  // Extrae los datos a actualizar del cuerpo
  ): Promise<Pokemon> {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  /**
   * Endpoint DELETE /pokemon/:id
   * Elimina un Pokémon de la base de datos
   * @param id - ID numérico del Pokémon a eliminar
   * @returns Promise<void> - No retorna contenido (código 204)
   * @throws NotFoundException si el Pokémon no existe
   */
  @Delete(':id')  // Maneja peticiones DELETE a /pokemon/:id
  @ApiOperation({ summary: 'Eliminar un Pokémon' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Pokémon' })
  @ApiResponse({ status: 204, description: 'Pokémon eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pokémon no encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)  // Código 204: éxito sin contenido en la respuesta
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pokemonService.remove(id);
  }
}

