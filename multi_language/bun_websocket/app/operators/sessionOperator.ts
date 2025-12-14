import type { ServerWebSocket } from 'bun'
import type Subscriber from '../infrastructure/pubsub/subscriber'
import type SessionRepository from '../repository/sessionRepository'
import type { Room } from '../types/room'
import type { Session } from '../types/session'
import type { WebSocketData } from '../types/websocketCommons'
import { setConnectedData } from '../utils/websocket'
import RoomOperator from './roomOperator'

class SessionOperator {
	private rooms: RoomOperator[]
	private sessionRepository: SessionRepository

	constructor(rooms: Room[], sessionRepository: SessionRepository) {
		this.rooms = rooms.map((room) => new RoomOperator(room))
		this.sessionRepository = sessionRepository
	}

	public initialize(subscriber: Subscriber) {
		this.rooms.forEach((room) => {
			subscriber.subscribe(room.id, room.subscriptionCallback())
		})
	}

	public async getSession(
		roomId: string,
		username: string,
	): Promise<null | Session> {
		return await this.sessionRepository.read(roomId, username)
	}

	public async createSession(
		connection: ServerWebSocket<WebSocketData>,
		roomId: string,
		username: string,
	): Promise<Session> {
		const ticket = setConnectedData(connection, roomId, username)
			.ticket as string

		const room = this.getRoomById(roomId) as RoomOperator
		room.addConnection(connection, username)

		const data = { ticket, username }
		await this.sessionRepository.save(roomId, username, data)

		return data
	}

	public async removeSession(roomId: string, username: string) {
		const room = this.getRoomById(roomId) as RoomOperator
		room.removeConnection(username)
		await this.sessionRepository.remove(roomId, username)
	}

	public async removeAllSessions() {
		for (const room of this.rooms) {
			for (const username in room.connections) {
				await this.removeSession(room.id, username)
			}
		}
	}

	private getRoomById(roomId: string): undefined | RoomOperator {
		return this.rooms.find(({ id }) => roomId === id)
	}
}

export default SessionOperator
