import httpx

_BASE_URL = 'https://pokeapi.co/api/v2/pokemon'

def get_pokemon(name: str) -> dict:
    """
        Realiza uma requisição GET na PokeAPI
        em busca de um pokémon pelo nome
    """

    with httpx.Client() as client:
        response = client.get(f'{ _BASE_URL }/{ name }')
        if response.status_code != httpx.codes.OK:
            return { 'message': f'Não foi possível achar o pokemon \"{ name }\"'}
        return _filter_informations(response.json())


def _filter_informations(pokemon_info: dict) -> dict:
    """
    Filtra os campos de interesse das informações
    recebidas da API de um pokémon
    """

    return {
        'abilities': pokemon_info.get('abilities', {}),
        'forms': pokemon_info.get('forms', {}),
        'height': pokemon_info.get('height', 0),
        'name': pokemon_info.get('name', ''),
        'species': pokemon_info.get('species', {}),
        'weight': pokemon_info.get('weight', 0),
    }
