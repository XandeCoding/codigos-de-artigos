import { SpanKind } from '@opentelemetry/api'
import type ValueKeyDatabase from '../infrastructure/database/valueKeyDatabase'
import Tracer from '../infrastructure/traces/tracer'

type SetFunction = (key: string, value: string, ttl: number) => Promise<'OK'>

function setEventDecorator(
	originalMethod: SetFunction,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (
		this: SetFunction,
		key: string,
		value: string,
		ttl: number,
	) {
		return Tracer.startActiveSpan(
			'cache-set',
			{ kind: SpanKind.CLIENT },
			async (span) => {
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('key', key)
					.setAttribute('value', value)
					.setAttribute('ttl', ttl)
					.setAttribute('peer.service', 'cache')
					.setAttribute('service.peer.service', 'cache')
					// ref: https://opentelemetry.io/docs/specs/semconv/db/redis/
					.setAttribute('db.system.name', 'redis')
					.setAttribute('db.operation.name', 'SET')

				const result = await originalMethod.call(this, key, value, ttl)

				span.setAttribute('result', result)
				span.end()
				return result
			},
		)
	}
}

type GetFunction = (key: string) => Promise<null | string>

function getEventDecorator(
	originalMethod: GetFunction,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (this: GetFunction, key: string) {
		return Tracer.startActiveSpan(
			'cache-set',
			{ kind: SpanKind.CLIENT },
			async (span) => {
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('key', key)
					.setAttribute('peer.service', 'cache')
					.setAttribute('service.peer.service', 'cache')
					// ref: https://opentelemetry.io/docs/specs/semconv/db/redis/
					.setAttribute('db.system.name', 'redis')
					.setAttribute('db.operation.name', 'GET')

				const result = await originalMethod.call(this, key)

				span.setAttribute('result', result ?? 'NOT-FOUND')
				span.end()
				return result
			},
		)
	}
}

type deleteFunction = (key: string) => Promise<number>

function deleteEventDecorator(
	originalMethod: deleteFunction,
	context: ClassMethodDecoratorContext,
) {
	const decoratorName = context.name.toString()

	return async function (this: deleteFunction, key: string) {
		return Tracer.startActiveSpan(
			'cache-set',
			{ kind: SpanKind.CLIENT },
			async (span) => {
				span
					.setAttribute('decorator', decoratorName)
					.setAttribute('key', key)
					.setAttribute('peer.service', 'cache')
					.setAttribute('service.peer.service', 'cache')
					// ref: https://opentelemetry.io/docs/specs/semconv/db/redis/
					.setAttribute('db.system.name', 'redis')
					.setAttribute('db.operation.name', 'DEL')

				const result = await originalMethod.call(this, key)

				span.setAttribute('result', result)
				span.end()
				return result
			},
		)
	}
}

class BaseRepository {
	private namespace: string
	private defaultTTL: number
	private database: ValueKeyDatabase

	constructor(
		database: ValueKeyDatabase,
		namespace: Uppercase<string> = 'DEFAULT',
		defaultTTL: number = 3600,
	) {
		this.database = database
		this.namespace = namespace
		this.defaultTTL = defaultTTL
	}

	protected transformKey(...values: string[]): string {
		return `${this.namespace}:${values.join(':')}`
	}

	@setEventDecorator
	protected async set(
		key: string,
		value: string,
		ttl: number = this.defaultTTL,
	): Promise<'OK'> {
		return this.database.client.set(key, value, 'EX', ttl)
	}

	@getEventDecorator
	protected async get(key: string): Promise<null | string> {
		return this.database.client.get(key)
	}

	@deleteEventDecorator
	protected async delete(key: string): Promise<number> {
		return this.database.client.del(key)
	}
}

export default BaseRepository
