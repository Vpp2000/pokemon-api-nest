import { Injectable } from '@nestjs/common';
import { PokedexApiResult, PokeResult } from './seed.types';
import { PokemonService } from '../pokemon/pokemon.service';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

const POKE_URL = 'https://pokeapi.co/api/v2/pokemon?limit=5';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async populateDb() {
    const rawResponse = await fetch(POKE_URL);
    const pokedexApiResultJson: PokedexApiResult = await rawResponse.json();

    const pokemons: PokeResult[] = pokedexApiResultJson.results;

    const pokemonsForDb: CreatePokemonDto[] = pokemons.map(({ name, url }) => {
      const segments = url.split('/');
      const identifier = +segments[segments.length - 2];

      return {
        name,
        identifier,
      };
    });

    const dbResponse = await this.pokemonModel.insertMany(pokemonsForDb);

    return dbResponse;
  }
}
