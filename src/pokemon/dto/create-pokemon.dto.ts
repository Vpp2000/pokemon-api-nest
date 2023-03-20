import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsString({ message: 'name must be a string' })
  @MinLength(1, { message: 'name cant be empty' })
  name: string;
  @IsInt({ message: 'identifier must be an integer' })
  @IsPositive({ message: 'identifier must be a positive number' })
  @Min(1, { message: 'identifier must be greater than 1' })
  identifier: number;
}
