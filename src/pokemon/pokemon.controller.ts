import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from '../entities/pokemon.entity';

@ApiTags('pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los Pokémons' })
  @ApiResponse({ status: 200, description: 'Lista de Pokémons obtenida exitosamente', type: [Pokemon] })
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Pokemon[]> {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un Pokémon por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Pokémon' })
  @ApiResponse({ status: 200, description: 'Pokémon encontrado', type: Pokemon })
  @ApiResponse({ status: 404, description: 'Pokémon no encontrado' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Pokemon> {
    return this.pokemonService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo Pokémon' })
  @ApiBody({ type: CreatePokemonDto })
  @ApiResponse({ status: 201, description: 'Pokémon creado exitosamente', type: Pokemon })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonService.create(createPokemonDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un Pokémon' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Pokémon' })
  @ApiBody({ type: UpdatePokemonDto })
  @ApiResponse({ status: 200, description: 'Pokémon actualizado exitosamente', type: Pokemon })
  @ApiResponse({ status: 404, description: 'Pokémon no encontrado' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    return this.pokemonService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un Pokémon' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del Pokémon' })
  @ApiResponse({ status: 204, description: 'Pokémon eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Pokémon no encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pokemonService.remove(id);
  }
}

