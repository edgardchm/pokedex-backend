// Importaciones de TypeORM para definir la entidad de base de datos
import {
  Entity,              // Decorador para marcar la clase como una entidad
  Column,             // Decorador para definir columnas de la tabla
  PrimaryGeneratedColumn,  // Decorador para columna de ID auto-generado
  ManyToMany,         // Decorador para relación muchos a muchos
  JoinTable,          // Decorador para definir la tabla intermedia (opcional en este lado)
} from 'typeorm';
import { Pokemon } from './pokemon.entity';

/**
 * Entidad Type que representa la tabla 'types' en la base de datos
 * Define la estructura de datos de un tipo de Pokémon (Fuego, Agua, Eléctrico, etc.)
 * Un tipo puede estar asociado a múltiples Pokémon
 */
@Entity('types')  // Especifica el nombre de la tabla en la base de datos
export class Type {
  /**
   * ID único del tipo
   * Se genera automáticamente por la base de datos (auto-increment)
   */
  @PrimaryGeneratedColumn()  // Columna de clave primaria auto-generada
  id: number;

  /**
   * Nombre del tipo de Pokémon
   * Columna de tipo texto (VARCHAR) con restricción UNIQUE
   * Esto garantiza que no puede haber dos tipos con el mismo nombre
   * Ejemplos: "fire", "water", "electric", "grass", "psychic"
   */
  @Column({ unique: true })  // Define una columna con restricción de unicidad
  name: string;

  /**
   * Relación muchos a muchos con la entidad Pokemon
   * Un tipo puede pertenecer a múltiples Pokémon
   * Un Pokémon puede tener múltiples tipos
   * 
   * Nota: La tabla intermedia 'pokemon_types' se define en el lado de Pokemon
   * usando @JoinTable. En este lado solo se declara la relación inversa.
   */
  @ManyToMany(() => Pokemon, (pokemon) => pokemon.types)  // Relación bidireccional
  pokemons: Pokemon[];  // Array de Pokémon que tienen este tipo
}



