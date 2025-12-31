import type { ServerWebSocket } from 'bun'
import Logger from '../infrastructure/log/logger'
import type { Conections } from '../types/connection'
import type {
	SubscribeCallback,
	WebSocketData,
} from '../types/websocketCommons'

class ConnectionsOperator {
	public connections: Conections

	constructor() {
		this.connections = {}
	}

	public addConnection(
		connection: ServerWebSocket<WebSocketData>,
		username: string,
	) {
		this.connections[username] = connection
	}

	public removeConnection(username: string) {
		delete this.connections[username]
	}

	public subscriptionCallback(): SubscribeCallback {
		return (message, channel) => {
			Logger.debug`subscribe data - channel: ${channel} message ${message}`

			Object.values(this.connections).forEach((ws) => {
				ws.send(message)
			})
		}
	}
}

export default ConnectionsOperator
