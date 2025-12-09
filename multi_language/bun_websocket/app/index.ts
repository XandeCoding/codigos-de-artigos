import Logger from './infrastructure/log/logger'
import Publisher from './operators/publisher'
import Subscriber from './operators/subscriber'
import UserRepository from './repository/userRepository'
import { getWebSocketData, setConnectedData, validateTicket } from './utils/websocket'
import type { Room, Message, WebSocketData } from './types/websocketCommons'
import ValueKeyDatabase from './infrastructure/database/valueKeyDatabase'


const rooms: Room[] = [
  {
    id: "1",
    name: "test",
  }
]

const database = new ValueKeyDatabase()
const userRepository = new UserRepository(database)
const publisher = new Publisher(database)
const subscriber = new Subscriber(database)


await subscriber.initialize(rooms)

Bun.serve({
  port: 3000,
  fetch(req, server) {
    const url = new URL(req.url)
    if (url.pathname === '/chats') {
      return Response.json({
        data: rooms
      })
    }

    else if (server.upgrade(req, getWebSocketData(server, req))) {
      Logger.debug `Connection upgraded`
      return 
    }
    
    return new Response("Upgrade failed", { status: 500 })
  },
  websocket: {
    data: {} as WebSocketData,
    open(ws) {
      Logger.debug `Hello new user ${ws.data}`
    },
    async message(ws, message: string) {
      Logger.debug `Message ${message}`
      const { roomId, username }: Message = JSON.parse(message)
      const user = await userRepository.read(roomId, username)

      Logger.debug `User, ${user}`

      if (!user) {
        const ticket = setConnectedData(ws, roomId, username).ticket as string
        subscriber.addConnection(ticket, ws)
        await userRepository.save(roomId, username, { ticket, username })
      } else if (validateTicket(ws, user)) {
        ws.close(-1, `User it's fake`)
      }

      await publisher.publish(roomId, message)
    },
    async close(ws, code, reason) {
      Logger.warn `Disconnected, code: ${code}, reason: ${reason}, ws: ${ws.data}`      
      const { roomId, username, ticket } = ws.data

      if (!roomId || !username || !ticket) return
      subscriber.removeConnection(ticket)
      await userRepository.remove(roomId, username)
    }
  }
})
