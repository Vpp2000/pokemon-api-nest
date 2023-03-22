export interface PokedexApiResult {
  count: number;
  next: string;
  previous: null;
  results: PokeResult[];
}

export interface PokeResult {
  name: string;
  url: string;
}
