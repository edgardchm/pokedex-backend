// Importaciones de NestJS para crear módulos
import { Module } from '@nestjs/common';
// Importación de TypeORM para registrar entidades
import { TypeOrmModule } from '@nestjs/typeorm';
// Importaciones de componentes del módulo Type
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { Type } from '../entities/type.entity';

/**
 * Módulo de Type que agrupa todos los componentes relacionados con Tipos de Pokémon
 * Este módulo:
 * - Registra la entidad Type en TypeORM
 * - Proporciona el TypeController para endpoints REST
 * - Proporciona el TypeService para lógica de negocio
 * - Exporta TypeService para que otros módulos (como PokemonModule) puedan usarlo
 */
@Module({
  // Registra la entidad Type en TypeORM para que esté disponible en los repositorios
  imports: [TypeOrmModule.forFeature([Type])],
  // Registra el controlador que maneja las rutas REST
  controllers: [TypeController],
  // Registra el servicio que contiene la lógica de negocio
  providers: [TypeService],
  // Exporta el servicio para que otros módulos puedan importarlo y usarlo
  // Esto permite que PokemonModule use TypeService para crear/buscar tipos
  exports: [TypeService],
})
export class TypeModule {}

