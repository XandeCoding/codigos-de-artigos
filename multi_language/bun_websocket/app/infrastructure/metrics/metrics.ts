import Meter from './meter'

const httpRequests = Meter.createCounter('http.requests', {
	description: 'Requests counter',
})

const httpRequestsLatency = Meter.createHistogram('http.requests.latency', {
	description: 'Requests latency histogram',
})

const messageSent = Meter.createCounter('message.sent', {
	description: 'Messages sent counter',
})

const messagePublishLatency = Meter.createHistogram('message.publish.latency', {
	description: 'Messages publish latency histogram',
})

const messageReceived = Meter.createCounter('message.received', {
	description: 'Messages received counter',
})

const messageReceivedLatency = Meter.createHistogram(
	'message.received.latency',
	{
		description: 'Messages Received latency histogram',
	},
)

const sessionCreated = Meter.createCounter('session.created', {
	description: 'Sessions created counter',
})

const sessionClosed = Meter.createCounter('session.closed', {
	description: 'Sessions closed counter',
})

const websocketMessageSent = Meter.createCounter('websocket.message.sent', {
	description: 'Websocket messages sent counter',
})

const websocketMessageSentLatency = Meter.createHistogram(
	'websocket.message.sent.latency',
	{
		description: 'Websocket messages sent latency histogram',
	},
)

export {
	httpRequests,
	httpRequestsLatency,
	messageSent,
	messageReceived,
	sessionCreated,
	sessionClosed,
	messagePublishLatency,
	messageReceivedLatency,
	websocketMessageSent,
	websocketMessageSentLatency,
}
