import Logger from "./infrastructure/log/logger"
import Publisher from "./operators/publisher"
import Subscriber from "./operators/subscriber"
import UserRepository from "./repository/userRepository"
import {
  getWebSocketData,
  parseMessage,
  validateTicket,
} from "./utils/websocket"
import type { WebSocketData } from "./types/websocketCommons";
import ValueKeyDatabase from "./infrastructure/database/valueKeyDatabase"
import SessionOperator from "./operators/sessionOperator"
import type { Room } from "./types/room"
import { requestCounter } from "./infrastructure/metrics/metrics"
import Tracer from "./infrastructure/traces/tracer"
import { context } from "@opentelemetry/api"
import { api } from "@opentelemetry/sdk-node"

const rooms: Room[] = [
  {
    id: "1",
    name: "test",
  },
];

const database = new ValueKeyDatabase()
const userRepository = new UserRepository(database)
const publisher = new Publisher(database)
const subscriber = new Subscriber(database)
const sessionOperator = new SessionOperator(rooms, userRepository)

await subscriber.initialize();
sessionOperator.initialize(subscriber)

Bun.serve({
  port: 3000,
  fetch(req, server) {
    requestCounter.add(1)
    const url = new URL(req.url);
    if (url.pathname === "/chats") {
      return Response.json({
        data: rooms,
      });
    } else if (server.upgrade(req, getWebSocketData(server, req))) {
      Logger.debug`Connection upgraded`
      return;
    }

    return new Response("Upgrade failed", { status: 500 })
  },
  websocket: {
    data: {} as WebSocketData,
    open(ws) {
      Logger.debug`Hello new user ${ws.data}`
    },
    async message(ws, rawMessage: string) {
      const span = Tracer.startSpan('Message Received')
      span.setAttribute('context', JSON.stringify(context.active().getValue))
      span.setAttribute('message', rawMessage)

      Logger.debug`Message ${rawMessage}`
      const message = parseMessage(rawMessage)
      if (!message) return

      const { roomId, username } = message
      const user = await sessionOperator.getUserSession(roomId, username)
      span.addEvent('get user data')

      Logger.debug `User, ${user}`;

      if (!user) {
        span.addEvent('data not found, creating session')
        await sessionOperator.createUserSession(ws, roomId, username)
      } else if (validateTicket(ws, user)) {
        span.setAttribute('invalid_user', JSON.stringify(user))
        span.setStatus({ code: api.SpanStatusCode.ERROR })
        span.end()
        return ws.close(-1, `User it's fake`)
      }

      span.setStatus({ code: api.SpanStatusCode.OK })
      span.setAttribute('valid_user', JSON.stringify(user))
      span.end()
      await publisher.publish(roomId, rawMessage);
    },
    async close(ws, code, reason) {
      Logger.warn`Disconnected, code: ${code}, reason: ${reason}, ws: ${ws.data}`;
      const { roomId, username, ticket } = ws.data

      if (!roomId || !username || !ticket) return
      sessionOperator.removeUserSession(roomId, username)
      await userRepository.remove(roomId, username)
    },
  },
});
