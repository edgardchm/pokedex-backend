import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './pokemon/pokemon.module';
import { TypeModule } from './type/type.module';
import { Pokemon } from './entities/pokemon.entity';
import { Type } from './entities/type.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Pokemon, Type],
      synchronize: true, // En producción usar migraciones
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false,
      } : false,
    }),
    PokemonModule,
    TypeModule,
  ],
})
export class AppModule {}

