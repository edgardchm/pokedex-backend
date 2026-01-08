import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from '../entities/type.entity';
import { CreateTypeDto } from './dto/create-type.dto';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
  ) {}

  async findAll(): Promise<Type[]> {
    return this.typeRepository.find();
  }

  async findOne(id: number): Promise<Type> {
    return this.typeRepository.findOne({ where: { id } });
  }

  async create(createTypeDto: CreateTypeDto): Promise<Type> {
    const existingType = await this.typeRepository.findOne({
      where: { name: createTypeDto.name.toLowerCase() },
    });

    if (existingType) {
      throw new ConflictException(
        `El tipo '${createTypeDto.name}' ya existe`,
      );
    }

    const type = this.typeRepository.create({
      name: createTypeDto.name.toLowerCase(),
    });

    return this.typeRepository.save(type);
  }

  async findOrCreate(typeName: string): Promise<Type> {
    const normalizedName = typeName.toLowerCase();
    let type = await this.typeRepository.findOne({
      where: { name: normalizedName },
    });

    if (!type) {
      type = this.typeRepository.create({ name: normalizedName });
      type = await this.typeRepository.save(type);
    }

    return type;
  }
}

