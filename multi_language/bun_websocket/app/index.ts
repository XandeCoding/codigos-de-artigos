import ValueKeyDatabase from './infrastructure/database/valueKeyDatabase'
import Logger from './infrastructure/log/logger'
import { requestCounter } from './infrastructure/metrics/metrics'
import Publisher from './infrastructure/pubsub/publisher'
import Subscriber from './infrastructure/pubsub/subscriber'
import MessageOperator from './operators/messageOperator'
import SessionOperator from './operators/sessionOperator'
import SessionRepository from './repository/sessionRepository'
import type { Room } from './types/room'
import type { WebSocketData } from './types/websocketCommons'
import { getWebSocketData } from './utils/websocket'

const rooms: Room[] = [
	{
		id: '1',
		name: 'test',
	},
]

const database = new ValueKeyDatabase()
const sessionRepository = new SessionRepository(database)
const publisher = new Publisher(database)
const subscriber = new Subscriber(database)
const sessionOperator = new SessionOperator(rooms, sessionRepository)
const messageOperator = new MessageOperator(sessionOperator, publisher)

await subscriber.initialize()
sessionOperator.initialize(subscriber)

process.on('SIGINT', () => {
	Logger.warn`Ctrl-C was pressed (SIGINT received) - Closing all connections`
	sessionOperator.removeAllSessions().then(() => process.exit())
})

Bun.serve({
	port: 3000,
	fetch(req, server) {
		requestCounter.add(1)
		const url = new URL(req.url)
		if (url.pathname === '/chats') {
			return Response.json({
				data: rooms,
			})
		} else if (server.upgrade(req, getWebSocketData(server, req))) {
			Logger.debug`Connection upgraded`
			return
		}

		return new Response('Upgrade failed', { status: 500 })
	},
	websocket: {
		data: {} as WebSocketData,
		open(ws) {
			Logger.debug`Hello new user ${ws.data}`
		},
		async message(ws, rawMessage: string) {
			await messageOperator.handleMessageEvent(ws, rawMessage)
		},
		async close(ws, code: number, reason: string) {
			await messageOperator.handleCloseEvent(ws, code, reason)
		},
	},
})
