import type { ServerWebSocket } from 'bun'
import Logger from '../infrastructure/log/logger'
import type Publisher from '../infrastructure/pubsub/publisher'
import {
	eventCloseSpan,
	eventCreatedSessionSpan,
	eventGenericErrorSpan,
	eventMessageReceivedSpan,
	eventPublishSpan,
	eventSessionReceivedSpan,
} from '../telemetry/messageEvents'
import type { WebSocketData } from '../types/websocketCommons'
import { TOPIC_NAME } from '../utils/constants'
import { parseMessage, setConnectedData } from '../utils/websocket'
import type SessionOperator from './sessionOperator'

class MessageOperator {
	private sessionOperator: SessionOperator
	private publisher: Publisher

	constructor(sessionOperator: SessionOperator, publisher: Publisher) {
		this.sessionOperator = sessionOperator
		this.publisher = publisher
	}

	public async handleMessageEvent(
		ws: ServerWebSocket<WebSocketData>,
		rawMessage: string,
	) {
		const span = eventMessageReceivedSpan(rawMessage, ws.remoteAddress)

		try {
			const { username } = parseMessage(rawMessage)

			const session = await this.sessionOperator.getSession(username)
			eventSessionReceivedSpan(span, session)

			if (!session) {
				const session = await this.sessionOperator.createSession(ws, username)
				setConnectedData(ws, username)
				eventCreatedSessionSpan(span, session)
			}

			await this.publisher.publish(TOPIC_NAME, rawMessage)
			eventPublishSpan(span, rawMessage, {
				username: ws.data.username as string,
			})
		} catch (error) {
			if (error instanceof Error) eventGenericErrorSpan(span, error)
		}
	}

	public async handleCloseEvent(
		ws: ServerWebSocket<WebSocketData>,
		code: number,
		reason: string,
	) {
		Logger.warn`Disconnected, code: ${code}, reason: ${reason}, ws: ${ws.data}`
		const { username } = ws.data

		// TODO: TEM QUE TER UM ERRO
		if (!username) return

		await this.sessionOperator.removeSession(username)

		eventCloseSpan(ws, code, reason, { username })
	}
}

export default MessageOperator
