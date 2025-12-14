import type { ServerWebSocket } from 'bun'
import type { WebSocketData } from './websocketCommons'

type Room = {
	id: string
	name: string
}

type RoomConnections = Record<string, ServerWebSocket<WebSocketData>>

export type { Room, RoomConnections }
