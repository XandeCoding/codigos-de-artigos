type Environment = 'DEVELOPMENT' | 'PRODUCTION'

type Config = {
	environment: Environment
	hostname: string
	redisUrl: string
	otlpHttpUrl: string
}

export type { Environment, Config }
