import ValueKeyDatabase from './infrastructure/database/valueKeyDatabase'
import Logger from './infrastructure/log/logger'
import Publisher from './operators/publisher'
import Subscriber from './operators/subscriber'
import RoomRepository from './repository/roomRepository'

type Room = {
  id: string
  name: string
  usernames: string[]
}

type Message = {
  username: string
  text: string
  roomId: string
}

// TODO: CRIAR MANAGER DE ROOMS E STORAGE (REDIS)
const rooms: Room[] = [
  {
    id: "1",
    name: "test",
    usernames: []
  }
]

// TODO: REFINAR UTILIZACAO DE INJECAO DE DEPENDENCIA
const database = new ValueKeyDatabase()
const roomRepository = new RoomRepository(database)
const publisher = new Publisher(database)
const subscriber = new Subscriber(database)

await subscriber.initialize()

const server = Bun.serve({
  port: 3000,
  fetch(req, server) {
    const url = new URL(req.url)
    if (url.pathname === '/chats') {
      return Response.json({
        data: rooms
      })
    }
    
    else if (server.upgrade(req)) {
      return; 
    }
    
    return new Response("Upgrade failed", { status: 500 })
  },
  websocket: {
    open(ws) {
      Logger.debug `Hello new user ${ws}`
    },
    async message(ws, message: string) {
      Logger.debug `Message ${message}`
      const { username, roomId }: Message = JSON.parse(message)

      const room = rooms.find(({id}) => id === roomId)

      Logger.debug `Room, ${room}`

      if (!room) return

      const userExist = !!room.usernames.includes(username)

      Logger.debug `User Exist, ${userExist}`

      if (!userExist) {
        room.usernames.push(username)
        await subscriber.subscribe(room.id, (message, channel) => {
          Logger.debug `Subscribe data - channel: ${channel} message ${message}`
          ws.send(message)
        })
      }
        
      await publisher.publish(room.id, message)
    },
  }
})
