import { SpanKind } from '@opentelemetry/api'
import { api } from '@opentelemetry/sdk-node'
import type { ServerWebSocket } from 'bun'
import Logger from '../infrastructure/log/logger'
import {
	messageReceived,
	messageReceivedLatency,
} from '../infrastructure/metrics/metrics'
import type Publisher from '../infrastructure/pubsub/publisher'
import Tracer from '../infrastructure/traces/tracer'
import type { WebSocketData } from '../types/websocketCommons'
import { TOPIC_NAME } from '../utils/constants'
import { parseMessage, setConnectedData } from '../utils/websocket'
import type SessionOperator from './sessionOperator'

type HandleMessageFunction = (
	ws: ServerWebSocket<WebSocketData>,
	rawMessage: string,
) => Promise<void>

function handleMessageEventDecorator(
	originalMethod: HandleMessageFunction,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (
		this: HandleMessageFunction,
		ws: ServerWebSocket<WebSocketData>,
		rawMessage: string,
	) {
		return Tracer.startActiveSpan(
			'handle-message',
			{ kind: SpanKind.SERVER },
			async (span) => {
				const startFunctionTime = performance.now()
				messageReceived.add(1, { remote_address: ws.remoteAddress })
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('ws-remote-addres', ws.remoteAddress)
					.setAttribute('ws-ready-state', ws.readyState)
					.setAttribute('raw-message', rawMessage)

				try {
					originalMethod.call(this, ws, rawMessage)
				} catch (error) {
					if (!(error instanceof Error)) return

					Logger.error`An error happened: ${error.message}`

					span.setStatus({ code: api.SpanStatusCode.ERROR })
					span.recordException(error)
				} finally {
					messageReceivedLatency.record(performance.now() - startFunctionTime, {
						'http.route': '/',
					})
					span.end()
				}
			},
		)
	}
}

class MessageOperator {
	private sessionOperator: SessionOperator
	private publisher: Publisher

	constructor(sessionOperator: SessionOperator, publisher: Publisher) {
		this.sessionOperator = sessionOperator
		this.publisher = publisher
	}

	@handleMessageEventDecorator
	public async handleMessageEvent(
		ws: ServerWebSocket<WebSocketData>,
		rawMessage: string,
	) {
		const { username } = parseMessage(rawMessage)

		const session = await this.sessionOperator.getSession(username)

		if (!session) {
			await this.sessionOperator.createSession(ws, username)
			setConnectedData(ws, username)
		}

		await this.publisher.publish(TOPIC_NAME, rawMessage)
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
	}
}

export default MessageOperator
