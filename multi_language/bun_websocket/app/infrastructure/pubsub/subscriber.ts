import { SpanKind } from '@opentelemetry/api'
import type { RedisClient } from 'bun'
import type ValueKeyDatabase from '../../infrastructure/database/valueKeyDatabase'
import type { SubscribeCallback } from '../../types/websocketCommons'
import Tracer from '../traces/tracer'

function subscriberInitializeEventDecorator(
	originalMethod: () => Promise<void>,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (this: SubscriberFunction) {
		return Tracer.startActiveSpan(
			'pubsub-subscriber-initialize',
			{ kind: SpanKind.CLIENT },
			async (span) => {
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('peer.service', 'pubsub')
					.setAttribute('service.peer.service', 'pubsub')
					// ref: https://opentelemetry.io/docs/specs/semconv/db/redis/
					.setAttribute('db.system.name', 'redis')
					.setAttribute('db.operation.name', 'CONNECT')

				const result = await originalMethod.call(this)

				span.end()
				return result
			},
		)
	}
}

type SubscriberFunction = (
	topic: string,
	callback: SubscribeCallback,
) => Promise<number>

function subscriberEventDecorator(
	originalMethod: SubscriberFunction,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (
		this: SubscriberFunction,
		topic: string,
		callback: SubscribeCallback,
	) {
		return Tracer.startActiveSpan(
			'pubsub-subscriber',
			{ kind: SpanKind.CONSUMER },
			async (span) => {
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('topic', topic)
					.setAttribute('peer.service', 'pubsub')
					.setAttribute('service.peer.service', 'pubsub')
					// ref: https://opentelemetry.io/docs/specs/semconv/db/redis/
					.setAttribute('db.system.name', 'redis')
					.setAttribute('db.operation.name', 'SUBSCRIBE')

				const result = await originalMethod.call(this, topic, callback)

				span.setAttribute('result', result)
				span.end()
				return result
			},
		)
	}
}

class Subscriber {
	private database: ValueKeyDatabase
	private subClient?: RedisClient

	constructor(database: ValueKeyDatabase) {
		this.database = database
	}

	@subscriberInitializeEventDecorator
	public async initialize() {
		this.subClient = await this.database.client.duplicate()
	}

	@subscriberEventDecorator
	public async subscribe(topic: string, callback: SubscribeCallback) {
		if (!this.subClient) throw TypeError('Subscribe must be not initialized')
		return this.subClient.subscribe(topic, callback)
	}
}

export default Subscriber
