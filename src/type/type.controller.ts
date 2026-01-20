// Importaciones de NestJS para crear controladores REST
import {
  Controller,      // Decorador para definir un controlador
  Get,            // Decorador para manejar peticiones GET
  Post,           // Decorador para manejar peticiones POST
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

// Importaciones de servicios y DTOs del módulo Type
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { Type } from '../entities/type.entity';

/**
 * Controlador REST para gestionar operaciones de Tipos de Pokémon
 * Los tipos representan las categorías elementales (Fuego, Agua, Eléctrico, etc.)
 * Todas las rutas están bajo el prefijo '/type'
 */
@ApiTags('type')  // Agrupa todos los endpoints bajo la etiqueta 'type' en Swagger
@Controller('type')  // Define la ruta base del controlador: /type
export class TypeController {
  // Inyección de dependencias: NestJS inyecta automáticamente el servicio
  constructor(private readonly typeService: TypeService) {}

  /**
   * Endpoint GET /type
   * Obtiene todos los tipos de Pokémon almacenados en la base de datos
   * @returns Promise<Type[]> - Lista completa de tipos disponibles
   */
  @Get()  // Maneja peticiones GET a /type
  @ApiOperation({ summary: 'Obtener todos los Tipos' })  // Descripción en Swagger
  @ApiResponse({ status: 200, description: 'Lista de Tipos obtenida exitosamente', type: [Type] })
  @HttpCode(HttpStatus.OK)  // Establece el código de respuesta HTTP a 200
  async findAll(): Promise<Type[]> {
    // Delega la lógica al servicio y retorna todos los tipos
    return this.typeService.findAll();
  }

  /**
   * Endpoint GET /type/:id
   * Obtiene un tipo específico por su ID
   * @param id - ID numérico del tipo (convertido automáticamente por ParseIntPipe)
   * @returns Promise<Type> - El tipo encontrado
   * @throws NotFoundException si el tipo no existe
   */
  @Get(':id')  // Maneja peticiones GET a /type/:id
  @ApiOperation({ summary: 'Obtener un Tipo por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Tipo' })  // Documenta el parámetro en Swagger
  @ApiResponse({ status: 200, description: 'Tipo encontrado', type: Type })
  @ApiResponse({ status: 404, description: 'Tipo no encontrado' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Type> {
    // ParseIntPipe convierte el parámetro de string a número y valida que sea entero
    return this.typeService.findOne(id);
  }

  /**
   * Endpoint POST /type
   * Crea un nuevo tipo de Pokémon en la base de datos
   * Valida que el tipo no exista previamente (los nombres son únicos)
   * @param createTypeDto - Datos del tipo a crear (solo requiere el nombre)
   * @returns Promise<Type> - El tipo creado con su ID asignado
   * @throws ConflictException si el tipo ya existe
   * @throws BadRequestException si los datos son inválidos
   */
  @Post()  // Maneja peticiones POST a /type
  @ApiOperation({ summary: 'Crear un nuevo Tipo' })
  @ApiBody({ type: CreateTypeDto })  // Documenta el formato del cuerpo en Swagger
  @ApiResponse({ status: 201, description: 'Tipo creado exitosamente', type: Type })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @HttpCode(HttpStatus.CREATED)  // Código 201 para recursos creados
  async create(@Body() createTypeDto: CreateTypeDto): Promise<Type> {
    // @Body() extrae y valida el JSON del cuerpo de la petición según CreateTypeDto
    return this.typeService.create(createTypeDto);
  }
}

