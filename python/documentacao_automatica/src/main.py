from view import read_pokemon_name, print_pokemon_data
from pokemon import get_pokemon

pokemon_name = read_pokemon_name()
pokemon_data = get_pokemon(pokemon_name)
print_pokemon_data(pokemon_data)
