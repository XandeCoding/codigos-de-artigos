import { type Attributes, context, type Span } from '@opentelemetry/api'
import { api } from '@opentelemetry/sdk-node'
import type { ServerWebSocket } from 'bun'
import Logger from '../infrastructure/log/logger'
import type Publisher from '../infrastructure/pubsub/publisher'
import Tracer from '../infrastructure/traces/tracer'
import { InvalidTicketError } from '../types/errors'
import type { Session } from '../types/session'
import type { WebSocketData } from '../types/websocketCommons'
import { parseMessage, ticketIsValid } from '../utils/websocket'
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
		const span = this.eventMessageReceivedSpan(rawMessage)

		try {
			const { roomId, username } = parseMessage(rawMessage)

			const session = await this.sessionOperator.getSession(roomId, username)
			this.eventSessionReceivedSpan(span, session)
			if (!session) {
				const session = await this.sessionOperator.createSession(
					ws,
					roomId,
					username,
				)
				this.eventCreatedSessionSpan(span, session)
			} else {
				this.validateTicket(ws, session)
			}

			await this.publisher.publish(roomId, rawMessage)
			this.eventPublishSpan(span)
		} catch (error) {
			if (error instanceof InvalidTicketError) {
				this.eventInvalidTicketSpan(span, error)
				ws.close(-1, 'Invalid session')
			} else if (error instanceof Error) this.eventGenericErrorSpan(span, error)
		}
	}

	public async handleCloseEvent(
		ws: ServerWebSocket<WebSocketData>,
		code: number,
		reason: string,
	) {
		Logger.warn`Disconnected, code: ${code}, reason: ${reason}, ws: ${ws.data}`
		const { roomId, username, ticket } = ws.data

		if (!roomId || !username || !ticket) return

		if (code === 1000) {
			await this.sessionOperator.removeSession(roomId, username)
		}

		this.eventCloseSpan(ws, code, reason)
	}

	private validateTicket(ws: ServerWebSocket<WebSocketData>, session: Session) {
		if (!ticketIsValid(ws, session)) {
			Logger.debug`Invalid data ${ws}, ${session}`
			throw new InvalidTicketError(ws.data.ticket as string)
		}
	}

	private eventMessageReceivedSpan(message: string): Span {
		Logger.debug`Message ${message}`

		const span = Tracer.startSpan('Message Received')
		span.setAttribute('context', JSON.stringify(context.active().getValue))
		return span.setAttribute('message', message)
	}

	private eventSessionReceivedSpan(span: Span, session: Session | null): Span {
		Logger.debug`Session, ${session}`

		const value = session || 'NOT FOUND'
		return span.addEvent('get session data', { session: value } as Attributes)
	}

	private eventCreatedSessionSpan(span: Span, session: Session): Span {
		Logger.info`Session created ${session}`

		return span.addEvent('data not found, session created', session)
	}

	private eventPublishSpan(span: Span) {
		span.addEvent('Message was published')
		span.end()
	}

	private eventInvalidTicketSpan(span: Span, error: InvalidTicketError): void {
		Logger.error`Invalid ticket: ${error.message}`

		span.addEvent('Invalid session ticket received from message', {
			ticket: error.ticket,
		})
		span.setStatus({ code: api.SpanStatusCode.ERROR })
		span.recordException(error)
	}

	private eventGenericErrorSpan(span: Span, error: Error): void {
		Logger.error`An error happened: ${error.message}`

		span.setStatus({ code: api.SpanStatusCode.ERROR })
		span.recordException(error)
	}

	private eventCloseSpan(
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
}

export default MessageOperator
