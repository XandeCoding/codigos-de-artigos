import type { ServerWebSocket } from 'bun'
import type { WebSocketData } from './websocketCommons'

type Conections = Record<string, ServerWebSocket<WebSocketData>>

export type { Conections }
