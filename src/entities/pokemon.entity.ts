// Importaciones necesarias de TypeORM y la entidad Type.
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

// Entidad principal de Pokemon.
@Entity('pokemons')
export class Pokemon {
  // ID interno autogenerado.
  @PrimaryGeneratedColumn()
  id: number;

  // Numero en la Pokedex nacional.
  @Column({ unique: true, nullable: true })
  pokedex_number: number;

  // Nombre del Pokemon.
  @Column()
  name: string;

  // Altura en decimetros.
  @Column('decimal', { precision: 5, scale: 2 })
  height: number;

  // Peso en hectogramos.
  @Column('decimal', { precision: 5, scale: 2 })
  weight: number;

  // Experiencia base que entrega al derrotarlo.
  @Column()
  base_experience: number;

  // URL del sprite principal.
  @Column()
  sprite_url: string;

  // Fecha de creacion del registro.
  @CreateDateColumn()
  created_at: Date;

  // Tipos asociados al Pokemon.
  @ManyToMany(() => Type, (type) => type.pokemons)
  @JoinTable({
    name: 'pokemon_types',  // Nombre de la tabla intermedia
    joinColumn: { name: 'pokemon_id', referencedColumnName: 'id' },  // Columna que referencia a Pokemon
    inverseJoinColumn: { name: 'type_id', referencedColumnName: 'id' },  // Columna que referencia a Type
  })
  types: Type[];  // Array de tipos asociados al Pokémon

  // ID del Pokemon previo en la cadena evolutiva.
  @Column({ nullable: true })
  evolves_from_id: number;

  // Referencia al Pokemon del que evoluciona.
  @ManyToOne(() => Pokemon, (pokemon) => pokemon.evolutions, { nullable: true })
  @JoinColumn({ name: 'evolves_from_id' })
  evolves_from: Pokemon;

  // Lista de evoluciones que parten de este Pokemon.
  @OneToMany(() => Pokemon, (pokemon) => pokemon.evolves_from)
  evolutions: Pokemon[];
}

