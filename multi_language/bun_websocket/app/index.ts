import Logger from './infrastructure/log/logger'

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
      Logger.debug('Hello new user', ws)
    },
    message(ws, message) {
      Logger.debug `Message ${message}, ${ typeof message}`
      const { username, roomId }: Message = JSON.parse(message)

      const room: Room = rooms.find(({id}) => id === roomId)

      Logger.debug `Room, ${room}`

      if (!room) return

      const userExist = !!room.usernames.includes(username)

      Logger.debug `User Exist, ${userExist}`

      if (!userExist) {
        ws.subscribe(room.name)
      }

      Logger.debug `Subscriptions, ${ws.subscriptions}`
      
      server.publish(room.name, message)
    },
  }
})
