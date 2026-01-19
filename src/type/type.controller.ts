import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { Type } from '../entities/type.entity';

@ApiTags('type')
@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los Tipos' })
  @ApiResponse({ status: 200, description: 'Lista de Tipos obtenida exitosamente', type: [Type] })
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Type[]> {
    return this.typeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un Tipo por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Tipo' })
  @ApiResponse({ status: 200, description: 'Tipo encontrado', type: Type })
  @ApiResponse({ status: 404, description: 'Tipo no encontrado' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Type> {
    return this.typeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo Tipo' })
  @ApiBody({ type: CreateTypeDto })
  @ApiResponse({ status: 201, description: 'Tipo creado exitosamente', type: Type })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTypeDto: CreateTypeDto): Promise<Type> {
    return this.typeService.create(createTypeDto);
  }
}

