import type { Server, ServerWebSocket } from 'bun'
import { getConfig } from '../infrastructure/config/config'
import Logger from '../infrastructure/log/logger'
import type { Message, WebSocketData } from '../types/websocketCommons'
import { NOT_FOUND_LABEL } from './constants'

function getWebSocketData(
	server: Server<WebSocketData>,
	req: Request,
): { data: WebSocketData } {
	return {
		data: {
			createdAt: Date.now(),
			instance: getConfig().hostname,
			origin: getOrigin(server, req),
		},
	}
}

function setConnectedData(
	ws: ServerWebSocket<WebSocketData>,
	username: string,
): WebSocketData {
	ws.data = {
		...ws.data,
		username,
	}

	return ws.data
}

function getOrigin(server: Server<WebSocketData>, req: Request): string {
	const requestIP = server.requestIP(req)

	if (!requestIP) {
		return NOT_FOUND_LABEL
	}

	return `${requestIP.address}:${requestIP.port}`
}

function parseMessage(messageRaw: string): Message {
	try {
		const { username, text } = JSON.parse(messageRaw)

		return { username, text }
	} catch (error) {
		Logger.error`Error trying to parse message ${error}`
		throw error
	}
}

export { getWebSocketData, setConnectedData, parseMessage }
