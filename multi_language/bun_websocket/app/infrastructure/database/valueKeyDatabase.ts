import { RedisClient } from 'bun'
import { getConfig } from '../config/config'
import Logger from '../log/logger'

class ValueKeyDatabase {
	private _client: RedisClient

	constructor() {
		this._client = new RedisClient(getConfig().redisUrl, {
			connectionTimeout: 5000,
			maxRetries: 5,
		})
	}

	get client(): RedisClient {
		return this._client as RedisClient
	}

	public async initialize() {
		this._client.onconnect = () => {
			Logger.info`Connection with Value Key Database estabilished`
		}
		this._client.onclose = () => {
			Logger.info`Connection with Value Key Database closed`
		}
		await this._client.connect()
	}
}

export default ValueKeyDatabase
