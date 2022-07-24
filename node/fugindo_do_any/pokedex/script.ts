interface IPokemon {
    id: number;
    name: string;
    sprites: { front_default: string }
}

interface IPokemonList {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{ name: string, url: string }>
}

const fetchPokemonList = (): Promise<IPokemonList> => {
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
    .then(response => response.json())
    .then((pokemonList: IPokemonList) => pokemonList)
}

const fetchPokemon = (url: string): Promise<IPokemon> => {
    return fetch(url)
    .then(response => response.json())
    .then((pokemon: IPokemon) => pokemon)
}


function createCard(pokemon: IPokemon) {
    const card = document.createElement('div');
    card.setAttribute('class', 'card');

    const title = document.createElement('h1')
    title.textContent = pokemon.name

    const sprite = document.createElement('img')
    sprite.setAttribute('class', 'sprite')
    sprite.src = pokemon.sprites.front_default

    container.appendChild(card)
    card.appendChild(title)
    card.appendChild(sprite)

}

const fetchAndCreateCard = (url: string) => {
    fetchPokemon(url)
    .then(pokemon => createCard(pokemon))
    .catch(error => console.error(error))
}

const app = document.getElementById('root')

if (!app) {
    throw new Error('Was not possible get root element')
}

const container = document.createElement('div')
container.setAttribute('class', 'container');

app.appendChild(container);

fetchPokemonList()
.then(pokemonList => {
    const promises = pokemonList.results.map(
        ({ url }) => fetchAndCreateCard(url)
    )

    return Promise.all(promises)
})


