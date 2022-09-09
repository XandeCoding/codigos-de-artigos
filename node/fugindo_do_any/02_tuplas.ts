type pokemonStrength = [string, number];
const pikachuStrength: pokemonStrength = ["pikachu", 10];

const printPokemonStrength = (pokemon: pokemonStrength) => {
  console.log(
    "\n\tPokemon: ",
    pokemon[0],
    "\n\tStrength: ",
    pokemon[1],
  );
};

printPokemonStrength(pikachuStrength);

// Forma literal
type pokemonScore = [string, ...boolean[]];
// type pokemonScore = [ string, ...Array<boolean> ]

const printPokemonScore = (pokemon: pokemonScore) => {
  console.log("\nPokemon: ", pokemon.shift());
  console.log("\n\nResultado das rinhas\n");

  pokemon.forEach((rinha, index) => {
    console.log(`${index}: ${rinha ? "GANHOU 👍" : "PERDEU 👎"}`);
  });
};

const pikachuScore: pokemonScore = ["pikachu", true, false, false, false];
printPokemonScore(pikachuScore);
