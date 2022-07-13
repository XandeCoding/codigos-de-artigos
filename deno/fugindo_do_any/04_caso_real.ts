interface Pokemon {
  name: string;
  type: string;
  weight: number;
}

interface Item {
  name: string;
  cost: number;
  fling_power: number;
}

// type FetchType = "item" | "pokemon";
enum FetchType {
  item = "item",
  pokemon = "pokemon",
}

const BASE_URL = "https://pokeapi.co/api/v2";

async function fetchUnknownData(
  type: FetchType,
  id: number,
): Promise<unknown> {
  const url = `${BASE_URL}/${type}/${id}`;
  const response = await fetch(url);
  return response.json();
}

try {
  console.log(
    "Fetching Unknown data: ",
    await fetchUnknownData(FetchType.pokemon, 1),
  );
} catch (error) {
  console.log(error);
}

try {
  // DOIS PROBLEMAS
  // O TIPO NÃO ESTÁ CORRETO HÁ MAIS CAMPOS QUE OS CONHECIDOS
  // ESTOU FORÇANDO AO TIPO SER RECONHECIDO, PODERIA COLOCAR QUALQUER OUTRA COISA
  const item = await fetchUnknownData(FetchType.item, 1) as Item;
  console.log(
    "Fetching Unknown data: ",
    item,
  );
} catch (error) {
  console.log(error);
}

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

async function fetchPokemon(id: number): Promise<Pokemon> {
  const url = `${BASE_URL}/${FetchType.pokemon}/${id}`;
  // TODO: CORRIGIR CAMPOS DA INTERFACE
  const responseJSON = await fetchData<Pokemon>(url);

  return {
    name: responseJSON.name,
    type: responseJSON.type,
    weight: responseJSON.weight,
  };
}

async function fetchItem(id: number): Promise<Item> {
  const url = `${BASE_URL}/${FetchType.item}/${id}`;
  // PONTO DE ATENÇÃO EM QUE NESSE PONTO TEMOS TODOS OS CAMPOS
  // DA INTERFACE MAS TEMOS MUITOS OUTROS
  const responseJSON = await fetchData<Item>(url);

  return {
    name: responseJSON.name,
    cost: responseJSON.cost,
    fling_power: responseJSON.fling_power,
  };
}

console.log("Pokemon: ", await fetchPokemon(1));
console.log("Item: ", await fetchItem(2));
export {};
