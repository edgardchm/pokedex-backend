import { IsString, IsNumber, IsArray, IsOptional, IsUrl } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;

  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  base_experience: number;

  @IsUrl()
  sprite_url: string;

  @IsArray()
  @IsOptional()
  typeIds?: number[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  typeNames?: string[];
}

