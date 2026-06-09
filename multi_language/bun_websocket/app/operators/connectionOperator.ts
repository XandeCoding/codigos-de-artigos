import { SpanKind } from '@opentelemetry/api'
import type { ServerWebSocket } from 'bun'
import Logger from '../infrastructure/log/logger'
import {
	websocketMessageSent,
	websocketMessageSentLatency,
} from '../infrastructure/metrics/metrics'
import Tracer from '../infrastructure/traces/tracer'
import type { Conections } from '../types/connection'
import type { WebSocketData } from '../types/websocketCommons'

type SubscribeCallbackFunction = (message: string, channel: string) => void

function subscriptionCallbackEventDecorator(
	originalMethod: SubscribeCallbackFunction,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (
		this: SubscribeCallbackFunction,
		message: string,
		channel: string,
	) {
		return Tracer.startActiveSpan(
			'connection-subscription-callback',
			{ kind: SpanKind.SERVER },
			async (span) => {
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('message', channel)
					.setAttribute('message', message)
				const startFunctionTime = performance.now()
				originalMethod.call(this, message, channel)

				const connectionsCount = Object.keys(
					ConnectionsOperator.connections,
				).length

				if (connectionsCount > 0) {
					websocketMessageSent.add(connectionsCount)
					websocketMessageSentLatency.record(
						performance.now() - startFunctionTime,
					)
				}

				span.end()
			},
		)
	}
}

class ConnectionsOperator {
	public static connections: Conections = {}

	public addConnection(
		connection: ServerWebSocket<WebSocketData>,
		username: string,
	) {
		ConnectionsOperator.connections[username] = connection
	}

	public removeConnection(username: string) {
		delete ConnectionsOperator.connections[username]
	}

	@subscriptionCallbackEventDecorator
	public subscriptionCallback(message: string, channel: string): void {
		Logger.debug`subscribe data - channel: ${channel} message ${message}`

		Object.values(ConnectionsOperator.connections).forEach((ws) => {
			const status = ws.send(message)

			Logger.debug`Message result was ${status}`
		})
	}
}

export default ConnectionsOperator
