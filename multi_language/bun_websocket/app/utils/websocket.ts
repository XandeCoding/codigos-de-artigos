import type { Server, ServerWebSocket } from 'bun'
import Logger from '../infrastructure/log/logger'
import type { Session } from '../types/session'
import type { Message, WebSocketData } from '../types/websocketCommons'

const NOT_FOUND = 'NOT-FOUND'

function getWebSocketData(
	server: Server<WebSocketData>,
	req: Request,
): { data: WebSocketData } {
	return {
		data: {
			createdAt: Date.now(),
			instance: process.env?.HOSTNAME ?? NOT_FOUND,
			origin: getOrigin(server, req),
		},
	}
}

function setConnectedData(
	ws: ServerWebSocket<WebSocketData>,
	roomId: string,
	username: string,
): WebSocketData {
	ws.data = {
		...ws.data,
		ticket: crypto.randomUUID(),
		roomId,
		username,
	}

	return ws.data
}

function ticketIsValid(
	ws: ServerWebSocket<WebSocketData>,
	session: Session,
): boolean {
	return !!session && ws.data.ticket === session.ticket
}

function getOrigin(server: Server<WebSocketData>, req: Request): string {
	const requestIP = server.requestIP(req)

	if (!requestIP) {
		return NOT_FOUND
	}

	return `${requestIP.address}:${requestIP.port}`
}

function parseMessage(messageRaw: string): Message {
	try {
		const { roomId, username, text } = JSON.parse(messageRaw)

		return { roomId, username, text }
	} catch (error) {
		Logger.error`Error trying to parse message ${error}`
		throw error
	}
}

export { getWebSocketData, setConnectedData, ticketIsValid, parseMessage }
