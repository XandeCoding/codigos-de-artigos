import { type Attributes, context, type Span } from '@opentelemetry/api'
import { api } from '@opentelemetry/sdk-node'
import type { ServerWebSocket } from 'bun'
import Logger from '../infrastructure/log/logger'
import Tracer from '../infrastructure/traces/tracer'
import type { Session } from '../types/session'
import type { WebSocketData } from '../types/websocketCommons'

export function eventMessageReceivedSpan(message: string): Span {
	Logger.debug`Message ${message}`

	const span = Tracer.startSpan('Message Received')
	span.setAttribute('context', JSON.stringify(context.active().getValue))
	return span.setAttribute('message', message)
}

export function eventSessionReceivedSpan(
	span: Span,
	session: Session | null,
): Span {
	Logger.debug`Session, ${session}`

	const value = session || 'NOT FOUND'
	return span.addEvent('get session data', { session: value } as Attributes)
}

export function eventCreatedSessionSpan(span: Span, session: Session): Span {
	Logger.info`Session created ${session}`

	return span.addEvent('data not found, session created', session)
}

export function eventPublishSpan(span: Span) {
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
) {
	const span = Tracer.startSpan('Closing connection')

	span.setAttribute('context', JSON.stringify(context.active().getValue))
	span.setAttribute('code', code)
	span.setAttribute('reason', reason)
	span.setAttributes(ws.data)
	span.setStatus({ code: api.SpanStatusCode.OK })
	span.end()
}
