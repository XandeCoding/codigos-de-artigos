import type { ServerWebSocket } from 'bun'
import type Subscriber from '../infrastructure/pubsub/subscriber'
import type SessionRepository from '../repository/sessionRepository'
import type { Session } from '../types/session'
import type { WebSocketData } from '../types/websocketCommons'
import { TOPIC_NAME } from '../utils/constants'
import type ConnectionsOperator from './connectionOperator'

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
			this.connectionsOperator.subscriptionCallback(),
		)
	}

	public async getSession(username: string): Promise<null | Session> {
		return await this.sessionRepository.read(username)
	}

	public async createSession(
		connection: ServerWebSocket<WebSocketData>,
		username: string,
	): Promise<Session> {
		this.connectionsOperator.addConnection(connection, username)

		const session = { username }
		await this.sessionRepository.save(username, session)
		return session
	}

	public async removeSession(username: string) {
		this.connectionsOperator.removeConnection(username)
		await this.sessionRepository.remove(username)
	}

	public async removeAllSessions() {
		for (const username in this.connectionsOperator.connections) {
			await this.removeSession(username)
		}
	}
}

export default SessionOperator
