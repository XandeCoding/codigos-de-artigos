import type ValueKeyDatabase from '../infrastructure/database/valueKeyDatabase'
import type { Session } from '../types/session'
import BaseRepository from './baseRepository'

class SessionRepository extends BaseRepository {
	constructor(database: ValueKeyDatabase) {
		super(database, 'SESSION')
	}

	public async save(roomId: string, username: string, value: Session) {
		return super.set(this.transformKey(roomId, username), JSON.stringify(value))
	}

	public async read(roomId: string, username: string): Promise<null | Session> {
		const data = await super.get(this.transformKey(roomId, username))

		if (data === null) return data

		return JSON.parse(data) as Session
	}

	public async remove(roomId: string, username: string): Promise<number> {
		return super.delete(this.transformKey(roomId, username))
	}
}

export default SessionRepository
