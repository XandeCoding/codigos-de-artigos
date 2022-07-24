interface PokemonInfo {
  type: string;
  weigth: number;
}

type PokemonName = "pikachu" | "caterpie" | "mankey"

const pokemon: Record<PokemonName, PokemonInfo> = {
  pikachu: { type: "eletric", weigth: 60 },
  caterpie: { type: "bug", weigth: 29 },
  mankey: { type: "fighting", weigth: 280 },
}
