import type { Server, ServerWebSocket } from "bun"
import type { WebSocketData } from "../types/websocketCommons"
import type { User } from "../types/user"

const NOT_FOUND = 'NOT-FOUND'

function getWebSocketData(server: Server<WebSocketData>, req: Request): { data: WebSocketData } {
  return {
      data: {
        createdAt: Date.now(),
        instance: process.env?.HOSTNAME ?? NOT_FOUND,
        origin: getOrigin(server, req),
      }
  }
}

function setConnectedData(ws: ServerWebSocket<WebSocketData>, roomId: string, username: string): WebSocketData  {  
  ws.data = {
    ...ws.data,
    ticket: crypto.randomUUID(),
    roomId,
    username,
  }

  return ws.data 
}

function validateTicket(ws: ServerWebSocket<WebSocketData>, user: User): boolean {
  return !!user && ws.data.ticket !== user.ticket
}

function getOrigin(server: Server<WebSocketData>, req: Request): string {
  const requestIP = server.requestIP(req)

  if (!requestIP) {
    return NOT_FOUND
  }

  return `${requestIP.address}:${requestIP.port}`
}


export { getWebSocketData, setConnectedData, validateTicket }
