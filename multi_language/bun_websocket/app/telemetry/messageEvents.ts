import { type Attributes, context, type Span } from '@opentelemetry/api'
import { api } from '@opentelemetry/sdk-node'
import type { ServerWebSocket } from 'bun'
import Logger from '../infrastructure/log/logger'
import {
	messagesReceivedMetric,
	messagesSentMetric,
	sessionsClosedMetric,
	sessionsCreatedMetric,
} from '../infrastructure/metrics/metrics'
import Tracer from '../infrastructure/traces/tracer'
import type { Session } from '../types/session'
import type { WebSocketData } from '../types/websocketCommons'
import { NOT_FOUND_LABEL } from '../utils/constants'

export function eventMessageReceivedSpan(
	message: string,
	remoteAddress: string,
): Span {
	Logger.debug`Message ${message}`

	messagesReceivedMetric.add(1, { remoteAddress })

	const span = Tracer.startSpan('Message Received')
	span.setAttribute('context', JSON.stringify(context.active().getValue))
	return span.setAttribute('message', message)
}

export function eventSessionReceivedSpan(
	span: Span,
	session: Session | null,
): Span {
	const value = session || NOT_FOUND_LABEL
	Logger.debug`Session, ${value}`

	return span.addEvent('get session data', { session: value } as Attributes)
}

export function eventCreatedSessionSpan(span: Span, session: Session): Span {
	Logger.info`Session created ${session}`

	sessionsCreatedMetric.add(1, { username: session.username })

	return span.addEvent('data not found, session created', session)
}

export function eventPublishSpan(
	span: Span,
	message: string,
	session: Session | null,
) {
	const username = session ? session.username : NOT_FOUND_LABEL

	Logger.debug`Message published: ${message}`

	messagesSentMetric.add(1, { username })

	span.addEvent('Message was published')
	span.end()
}

export function eventGenericErrorSpan(span: Span, error: Error): void {
	Logger.error`An error happened: ${error.message}`

	span.setStatus({ code: api.SpanStatusCode.ERROR })
	span.recordException(error)
}

export function eventCloseSpan(
	ws: ServerWebSocket<WebSocketData>,
	code: number,
	reason: string,
	session: Session,
) {
	const username = session.username
	Logger.debug`Session has been closed code: ${code}, reason: ${reason}, username: ${username}`
	sessionsClosedMetric.add(1, { code, username })
	const span = Tracer.startSpan('Closing connection')

	span.setAttribute('context', JSON.stringify(context.active().getValue))
	span.setAttribute('code', code)
	span.setAttribute('reason', reason)
	span.setAttribute('username', session.username)
	span.setAttributes(ws.data)
	span.setStatus({ code: api.SpanStatusCode.OK })
	span.end()
}
