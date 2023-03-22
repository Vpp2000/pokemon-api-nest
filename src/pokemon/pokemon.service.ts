import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemonDb = await this.pokemonModel.create(createPokemonDto);
      return pokemonDb;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon already exists in DB ${JSON.stringify(error.keyValue)}`,
        );
      }
      throw new InternalServerErrorException(
        "Can't create pokemon -- Check server logs",
      );
    }
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOneByCustomIdentifier(term: string) {
    let pokemonDb!: Pokemon;

    if (this.isNumericString(term)) {
      pokemonDb = await this.pokemonModel.findOne({ identifier: term });
    }

    if (!pokemonDb) {
      throw new NotFoundException(
        `Pokemon with id, name or identifier ${term} not found`,
      );
    }

    return pokemonDb;
  }

  async findOneById(id: string) {
    let pokemonDb!: Pokemon;

    if (isValidObjectId(id)) {
      pokemonDb = await this.pokemonModel.findById(id);
    }

    if (!pokemonDb) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }

    return pokemonDb;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonDb: Pokemon = await this.pokemonModel.findById(id);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      const updatedPokemonDb = await pokemonDb.updateOne(updatePokemonDto, {
        new: true,
      });
      return { ...pokemonDb, ...updatedPokemonDb };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const dbResponse = await this.pokemonModel.deleteMany({ _id: id });
    const { deletedCount } = dbResponse;

    if (deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id ${id} does not exist`);
    }

    return dbResponse;
  }

  private isNumericString(str: string) {
    return !isNaN(+str);
  }

  private handleError(error) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exists in DB ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      "Can't alter pokemon db -- Check server logs",
    );
  }
}
