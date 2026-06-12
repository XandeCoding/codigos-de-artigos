import { SpanKind } from '@opentelemetry/api'
import type ValueKeyDatabase from '../../infrastructure/database/valueKeyDatabase'
import { messagePublishLatency, messageSent } from '../metrics/metrics'
import Tracer from '../traces/tracer'

type PublishFunction = (topic: string, message: string) => Promise<number>

function publishEventDecorator(
	originalMethod: PublishFunction,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (
		this: PublishFunction,
		topic: string,
		message: string,
	) {
		return Tracer.startActiveSpan(
			'pubsub-publish',
			{ kind: SpanKind.PRODUCER },
			async (span) => {
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('topic', topic)
					.setAttribute('message', message)
					.setAttribute('peer.service', 'pubsub')
					.setAttribute('service.peer.service', 'pubsub')
					// ref: https://opentelemetry.io/docs/specs/semconv/db/redis/
					.setAttribute('db.system.name', 'redis')
					.setAttribute('db.operation.name', 'PUBLISH')

				const startFunctionTime = performance.now()
				const result = await originalMethod.call(this, topic, message)
				messagePublishLatency.record(performance.now() - startFunctionTime)

				messageSent.add(1)
				span.setAttribute('result', result)
				span.end()
				return result
			},
		)
	}
}

class Publisher {
	private database: ValueKeyDatabase

	constructor(database: ValueKeyDatabase) {
		this.database = database
	}

	@publishEventDecorator
	public async publish(topic: string, message: string): Promise<number> {
		return this.database.client.publish(topic, message)
	}
}

export default Publisher
