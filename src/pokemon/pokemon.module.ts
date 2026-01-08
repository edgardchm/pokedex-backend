import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { PokemonGateway } from './pokemon.gateway';
import { Pokemon } from '../entities/pokemon.entity';
import { Type } from '../entities/type.entity';
import { TypeModule } from '../type/type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pokemon, Type]),
    TypeModule,
  ],
  controllers: [PokemonController],
  providers: [PokemonService, PokemonGateway],
  exports: [PokemonGateway],
})
export class PokemonModule {}

