const pikachu: string = "pikachu";
const haunter = "haunter";
const now_date = Date.now();

const printPokemon = (pokemon_name: string) => {
  console.log("pokemon: ", pokemon_name);
};

printPokemon(haunter);
// DESCOMENTAR MOSTRA O ERRO DE TIPAGEM
// printPokemon(now_date)
