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

type SubscribeCallback = (message: string, channel: string) => void

export type { Message, WebSocketData, SubscribeCallback }
