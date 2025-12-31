import ValueKeyDatabase from './infrastructure/database/valueKeyDatabase'
import Logger from './infrastructure/log/logger'
import Publisher from './infrastructure/pubsub/publisher'
import Subscriber from './infrastructure/pubsub/subscriber'
import ConnectionsOperator from './operators/connectionOperator'
import MessageOperator from './operators/messageOperator'
import routerOperatorHandler from './operators/routerOperator'
import SessionOperator from './operators/sessionOperator'
import SessionRepository from './repository/sessionRepository'
import type { WebSocketData } from './types/websocketCommons'
import { setShutdownCycle } from './utils/lifeCycle'

Logger.info`App has started`

const database = new ValueKeyDatabase()
const sessionRepository = new SessionRepository(database)
const publisher = new Publisher(database)
const subscriber = new Subscriber(database)
const connectionsOperator = new ConnectionsOperator()
const sessionOperator = new SessionOperator(
	connectionsOperator,
	sessionRepository,
)
const messageOperator = new MessageOperator(sessionOperator, publisher)

await database.initialize()
await subscriber.initialize()
sessionOperator.initialize(subscriber)
setShutdownCycle(sessionOperator)

Logger.info`App has Initialized Successfully`

Bun.serve({
	port: 3000,
	fetch(req, server) {
		return routerOperatorHandler(req, server)
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
