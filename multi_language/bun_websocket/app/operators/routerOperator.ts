import type { Server } from 'bun'
import Logger from '../infrastructure/log/logger'
import { getWebSocketData } from '../utils/websocket'

function routerOperatorHandler(req: Request, server: Server<object>) {
	const { pathname } = new URL(req.url)

	switch (pathname) {
		case '/chat':
			return chatRouteHandler()
		default:
			return upgradeRouteHandler(req, server)
	}
}

function chatRouteHandler() {
	return Response.json({
		data: 'oi',
	})
}

function upgradeRouteHandler(req: Request, server: Server<object>) {
	if (server.upgrade(req, getWebSocketData(server, req))) {
		Logger.debug`Connection upgraded`
		return
	}

	return new Response('Upgrade failed', { status: 500 })
}

export default routerOperatorHandler
