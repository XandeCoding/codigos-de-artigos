const https = require('node:https');

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

const genericFetch = <T>(url: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        https.get(url, (response: any) => {
            const splittedData: any = []

            response.on('data', (chunk: any) => {
                splittedData.push(chunk)
            })

            response.on('end', () => {
                try {
                    const allData = splittedData.join('')
                    const parsedData = JSON.parse(allData) as T

                    return resolve(parsedData)
                } catch(error) {
                    console.error('Error processing data received')
                    return reject(error)
                }
            }).on('error', (error: any) => {
                console.error('Error downloading data')
                return reject(error)
            })

        })
    })
}

const downloadPokemon = async (id: number): Promise<Pokemon> => {
    const response = await genericFetch<Pokemon>(
        `${ BASE_URL }/${ FetchType.pokemon }/${ id }`
    )

    return response
}

const downloadItem = async (id: number): Promise<Item> => {
    const response = await genericFetch<Item>(
        `${ BASE_URL }/${ FetchType.item }/${ id }`
    )

    return response
}

downloadPokemon(1).then((response) => console.log(response))
downloadItem(1).then((response) => console.log(response))
