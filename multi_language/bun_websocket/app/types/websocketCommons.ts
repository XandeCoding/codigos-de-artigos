type Message = {
	username: string
	text: string
	roomId: string
}

type WebSocketData = {
	createdAt: number
	instance: string
	origin: string
	ticket?: string
	username?: string
	roomId?: string
}

type SubscribeCallback = (message: string, channel: string) => void

export type { Message, WebSocketData, SubscribeCallback }
