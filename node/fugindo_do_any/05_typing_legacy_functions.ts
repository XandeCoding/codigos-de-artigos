import https from 'https'
import { BASE_URL, FetchType, Pokemon } from './commons'

const genericFetchTyped = <T>(url: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        type httpEvents = 'response' | 'data' | 'end'
        type httpResponse = {
            on: (key: 'error', callback: (error: Error) => void) => void
        }
        type responseEvent = {
            on: (key: httpEvents, callback: (buffer?: Buffer) => void) => void
        }

        const httpGet = https.get as (
            url: string,
            callback: (response: responseEvent) => void
        ) => httpResponse

        httpGet(url, (response: responseEvent) => {
            const splittedData: Buffer[] = []

            response.on('data', (chunk) => {
                splittedData.push(chunk as Buffer)
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
            })

        }).on('error', (error) => {
            console.error('Error downloading data')
            return reject(error)
        })
    })
}

genericFetchTyped<Pokemon>(
    `${ BASE_URL }/${ FetchType.pokemon }/3`
)
.then((response) => console.log(`Pokemon: ${ response.name }`))
