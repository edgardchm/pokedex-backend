import { IsString, IsNumber, IsArray, IsOptional, IsUrl } from 'class-validator';

export class UpdatePokemonDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  base_experience?: number;

  @IsUrl()
  @IsOptional()
  sprite_url?: string;

  @IsArray()
  @IsOptional()
  typeIds?: number[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  typeNames?: string[];
}

