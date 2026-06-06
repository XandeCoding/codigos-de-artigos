type Message = {
	username: string
	text: string
}

type WebSocketData = {
	createdAt: number
	instance: string
	origin: string
	username?: string
}

export type { Message, WebSocketData }
