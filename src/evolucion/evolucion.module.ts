import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvolucionController } from './evolucion.controller';
import { EvolucionService } from './evolucion.service';
import { Pokemon } from '../entities/pokemon.entity';

/**
 * Módulo de Evolución
 * Gestiona las funcionalidades relacionadas con las evoluciones de Pokémon
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon]), // Importa el repositorio de Pokemon
  ],
  controllers: [EvolucionController],
  providers: [EvolucionService],
  exports: [EvolucionService], // Exporta el servicio para uso en otros módulos
})
export class EvolucionModule {}
