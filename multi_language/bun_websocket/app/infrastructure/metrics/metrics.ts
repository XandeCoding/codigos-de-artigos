import Meter from './meter'

const requestsMetric = Meter.createCounter('requests', {
	description: 'Requests counter',
})

const messagesSentMetric = Meter.createCounter('messages_sent_metric', {
	description: 'Messages sent counter',
})

const messagesReceivedMetric = Meter.createCounter('messages_received_metric', {
	description: 'Messages received counter',
})

const sessionsCreatedMetric = Meter.createCounter('sessions_created_metric', {
	description: 'Sessions created counter',
})

const sessionsClosedMetric = Meter.createCounter('sessions_closed_metric', {
	description: 'Sessions closed counter',
})

export {
	requestsMetric,
	messagesSentMetric,
	messagesReceivedMetric,
	sessionsCreatedMetric,
	sessionsClosedMetric,
}
