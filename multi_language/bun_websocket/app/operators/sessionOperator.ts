import { SpanKind } from '@opentelemetry/api'
import type { ServerWebSocket } from 'bun'
import type Subscriber from '../infrastructure/pubsub/subscriber'
import Tracer from '../infrastructure/traces/tracer'
import type SessionRepository from '../repository/sessionRepository'
import type { Session } from '../types/session'
import type { WebSocketData } from '../types/websocketCommons'
import { TOPIC_NAME } from '../utils/constants'
import ConnectionsOperator from './connectionOperator'

type CreateSessionFunction = (
	connection: ServerWebSocket<WebSocketData>,
	username: string,
) => Promise<Session>

function createSessionEventDecorator(
	originalMethod: CreateSessionFunction,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (
		this: CreateSessionFunction,
		connection: ServerWebSocket<WebSocketData>,
		username: string,
	) {
		return Tracer.startActiveSpan(
			'create-session',
			{ kind: SpanKind.INTERNAL },
			async (span) => {
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('connection-remote-address', connection.remoteAddress)
					.setAttribute('username', username)

				const result = originalMethod.call(this, connection, username)
				span.end()
				return result
			},
		)
	}
}

type RemoveSessionFunction = (username: string) => Promise<void>

function removeSessionEventDecorator(
	originalMethod: RemoveSessionFunction,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (this: RemoveSessionFunction, username: string) {
		return Tracer.startActiveSpan(
			'remove-session',
			{ kind: SpanKind.INTERNAL },
			async (span) => {
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('username', username)

				originalMethod.call(this, username)
				span.end()
			},
		)
	}
}

class SessionOperator {
	private connectionsOperator: ConnectionsOperator
	private sessionRepository: SessionRepository

	constructor(
		connectionsOperator: ConnectionsOperator,
		sessionRepository: SessionRepository,
	) {
		this.connectionsOperator = connectionsOperator
		this.sessionRepository = sessionRepository
	}

	public initialize(subscriber: Subscriber) {
		subscriber.subscribe(
			TOPIC_NAME,
			this.connectionsOperator.subscriptionCallback,
		)
	}

	public async getSession(username: string): Promise<null | Session> {
		return await this.sessionRepository.read(username)
	}

	@createSessionEventDecorator
	public async createSession(
		connection: ServerWebSocket<WebSocketData>,
		username: string,
	): Promise<Session> {
		this.connectionsOperator.addConnection(connection, username)

		const session = { username }
		await this.sessionRepository.save(username, session)
		return session
	}

	@removeSessionEventDecorator
	public async removeSession(username: string) {
		this.connectionsOperator.removeConnection(username)
		await this.sessionRepository.remove(username)
	}

	public async removeAllSessions() {
		for (const username in ConnectionsOperator.connections) {
			await this.removeSession(username)
		}
	}
}

export default SessionOperator
