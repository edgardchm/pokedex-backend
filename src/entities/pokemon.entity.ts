import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { Type } from './type.entity';

@Entity('pokemons')
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  height: number;

  @Column('decimal', { precision: 5, scale: 2 })
  weight: number;

  @Column()
  base_experience: number;

  @Column()
  sprite_url: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Type, (type) => type.pokemons)
  @JoinTable({
    name: 'pokemon_types',
    joinColumn: { name: 'pokemon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'type_id', referencedColumnName: 'id' },
  })
  types: Type[];
}

