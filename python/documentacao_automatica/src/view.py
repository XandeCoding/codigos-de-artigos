import pprint

def read_pokemon_name() -> str:
    """
    Faz a leitura de um nome de pokémon
    """

    try:
        return str(
            input('Digite o nome do pokemon a ser buscado: ')) \
            .lower()
    except Exception as error:
        print(error)

def print_pokemon_data(pokemon_data: dict) -> str:
    """
    Formata os dados relacionados com um pokémon
    para facilitar a legibilidade dos dados
    """

    pprint.pprint(pokemon_data)
