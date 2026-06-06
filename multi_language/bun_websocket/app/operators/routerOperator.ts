import type { Server } from 'bun'
import Logger from '../infrastructure/log/logger'
import { requestsMetric } from '../infrastructure/metrics/metrics'
import { getWebSocketData } from '../utils/websocket'

async function routerOperatorHandler(req: Request, server: Server<object>) {
	const { pathname } = new URL(req.url)
	requestsMetric.add(1, { pathname })

	if (req.headers.get('upgrade')?.toLowerCase() === 'websocket') {
		return upgradeRouteHandler(req, server)
	}

	switch (pathname) {
		case '/chat':
			return chatRouteHandler()
		default:
			return await staticFileHandler(pathname)
	}
}

function chatRouteHandler() {
	return Response.json({
		data: 'oi',
	})
}

async function staticFileHandler(pathname: string) {
	const file = Bun.file(getFilePath(pathname))
	const exists = await file.exists()

	if (!exists) {
		return new Response('Not Found', { status: 404 })
	}

	return new Response(file)
}

function getFilePath(pathname: string): string {
	if (pathname === '/') {
		return './public/index.html'
	}

	return `./public${pathname}`
}

function upgradeRouteHandler(req: Request, server: Server<object>) {
	if (server.upgrade(req, getWebSocketData(server, req))) {
		Logger.debug`Connection upgraded`
		return
	}

	return new Response('Upgrade failed', { status: 500 })
}

export default routerOperatorHandler
