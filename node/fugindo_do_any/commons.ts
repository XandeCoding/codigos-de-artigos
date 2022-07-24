const BASE_URL = "https://pokeapi.co/api/v2";

enum FetchType {
    item = "item",
    pokemon = "pokemon",
}

interface Pokemon {
    id: number;
    name: string;
}

interface Item {
    name: string;
    cost: number;
    fling_power: number;
}

export {
    Pokemon, Item, FetchType, BASE_URL
}
