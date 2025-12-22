import type { Config, Environment } from '../../types/config'

function getEnvironment(): Environment {
	const environment = process.env.ENVIRONMENT ?? 'DEVELOPMENT'
	return environment as Environment
}

function getConfig(): Config {
	return {
		environment: getEnvironment(),
		hostname: process.env.HOSTNAME ?? 'NOT_FOUND',
		redisUrl: process.env.REDIS_URL ?? '',
		otlpHttpUrl: process.env.OTLP_HTTP_URL ?? '',
	}
}

export { getConfig }
