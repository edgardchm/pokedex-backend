// Importaciones de TypeORM para definir la entidad de base de datos
import {
  Entity,              // Decorador para marcar la clase como una entidad
  Column,             // Decorador para definir columnas de la tabla
  PrimaryGeneratedColumn,  // Decorador para columna de ID auto-generado
  ManyToMany,         // Decorador para relación muchos a muchos
  ManyToOne,          // Decorador para relación muchos a uno
  OneToMany,          // Decorador para relación uno a muchos
  JoinTable,          // Decorador para definir la tabla intermedia
  JoinColumn,         // Decorador para definir columna de relación
  CreateDateColumn,   // Decorador para columna de fecha de creación automática
} from 'typeorm';
import { Type } from './type.entity';

/**
 * Entidad Pokemon que representa la tabla 'pokemons' en la base de datos
 * Define la estructura de datos de un Pokémon y su relación con los tipos
 */
@Entity('pokemons')  // Especifica el nombre de la tabla en la base de datos
export class Pokemon {
  /**
   * ID único del Pokémon
   * Se genera automáticamente por la base de datos (auto-increment)
   */
  @PrimaryGeneratedColumn()  // Columna de clave primaria auto-generada
  id: number;

  /**
   * Número del Pokémon en la Pokédex Nacional
   * Columna de tipo entero único
   */
  @Column({ unique: true, nullable: true })
  pokedex_number: number;

  /**
   * Nombre del Pokémon
   * Columna de tipo texto (VARCHAR)
   */
  @Column()  // Define una columna estándar en la tabla
  name: string;

  /**
   * Altura del Pokémon en decímetros
   * Tipo decimal con precisión de 5 dígitos y 2 decimales (ej: 999.99)
   */
  @Column('decimal', { precision: 5, scale: 2 })
  height: number;

  /**
   * Peso del Pokémon en hectogramos
   * Tipo decimal con precisión de 5 dígitos y 2 decimales
   */
  @Column('decimal', { precision: 5, scale: 2 })
  weight: number;

  /**
   * Experiencia base que otorga el Pokémon
   * Columna de tipo entero
   */
  @Column()
  base_experience: number;

  /**
   * URL de la imagen (sprite) del Pokémon
   * Columna de tipo texto para almacenar la URL
   */
  @Column()
  sprite_url: string;

  /**
   * Fecha y hora de creación del registro
   * Se establece automáticamente cuando se crea el Pokémon
   */
  @CreateDateColumn()  // Se actualiza automáticamente al crear el registro
  created_at: Date;

  /**
   * Relación muchos a muchos con la entidad Type
   * Un Pokémon puede tener múltiples tipos (ej: Fuego y Volador)
   * Un tipo puede pertenecer a múltiples Pokémon
   * 
   * @JoinTable define la tabla intermedia 'pokemon_types' que conecta
   * las dos entidades. Esta tabla tiene:
   * - pokemon_id: referencia al ID del Pokémon
   * - type_id: referencia al ID del Tipo
   */
  @ManyToMany(() => Type, (type) => type.pokemons)  // Relación bidireccional
  @JoinTable({
    name: 'pokemon_types',  // Nombre de la tabla intermedia
    joinColumn: { name: 'pokemon_id', referencedColumnName: 'id' },  // Columna que referencia a Pokemon
    inverseJoinColumn: { name: 'type_id', referencedColumnName: 'id' },  // Columna que referencia a Type
  })
  types: Type[];  // Array de tipos asociados al Pokémon

  /**
   * ID del Pokémon del cual evoluciona este Pokémon
   * Es null si el Pokémon es la forma base (no evoluciona de nadie)
   */
  @Column({ nullable: true })
  evolves_from_id: number;

  /**
   * Relación muchos a uno con el Pokémon predecesor en la cadena evolutiva
   * Permite obtener el Pokémon del cual evoluciona
   */
  @ManyToOne(() => Pokemon, (pokemon) => pokemon.evolutions, { nullable: true })
  @JoinColumn({ name: 'evolves_from_id' })
  evolves_from: Pokemon;

  /**
   * Relación uno a muchos con los Pokémon que evolucionan de este
   * Permite obtener todas las evoluciones posibles (ej: Gloom → Vileplume o Bellossom)
   */
  @OneToMany(() => Pokemon, (pokemon) => pokemon.evolves_from)
  evolutions: Pokemon[];
}

