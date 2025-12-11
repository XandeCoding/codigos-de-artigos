import type { ServerWebSocket } from "bun"
import type UserRepository from "../repository/userRepository"
import type { User } from "../types/user"
import type { WebSocketData } from "../types/websocketCommons"
import { setConnectedData } from "../utils/websocket"
import RoomOperator from "./roomOperator"
import type Subscriber from "./subscriber"
import type { Room } from "../types/room"

class SessionOperator {
  private rooms: RoomOperator[]
  private userRepository: UserRepository

  constructor(rooms: Room[], userRepository: UserRepository) {
    this.rooms = rooms.map(room => new RoomOperator(room))
    this.userRepository = userRepository
  }

  public initialize(subscriber: Subscriber) {
    this.rooms.forEach(room => { subscriber.subscribe(room.id, room.subscriptionCallback()) })
  }
  
  public async getUserSession(roomId: string, username: string): Promise<null | User> {
    return await this.userRepository.read(roomId, username)
  }

  public async createUserSession(connection: ServerWebSocket<WebSocketData>, roomId: string, username: string) {
    const ticket = setConnectedData(connection, roomId, username).ticket as string;
    const room = this.getRoomById(roomId) as RoomOperator

    room.addConnection(connection, username)
    await this.userRepository.save(roomId, username, { ticket, username });
  }

  public async removeUserSession(roomId: string, username: string) {
    const room = this.getRoomById(roomId) as RoomOperator
    room.removeConnection(username)
  }

  private getRoomById(roomId: string): undefined | RoomOperator {
    return this.rooms.find(({ id }) => roomId === id)
  }

}

export default SessionOperator
