import { configure, getConsoleSink } from '@logtape/logtape'
import { getOpenTelemetrySink } from '@logtape/otel'
import { getConfig } from '../config/config'

await configure({
	sinks: {
		console: getConsoleSink(),
		otel: getOpenTelemetrySink({
			serviceName: 'oltp_service',
			otlpExporterConfig: {
				url: `${getConfig().otlpHttpUrl}/v1/logs`,
			},
			diagnostics: false,
		}),
	},
	loggers: [
		{
			category: ['logtape', 'meta'],
			sinks: ['console', 'otel'],
			lowestLevel: 'warning',
		},
		{
			category: ['web_chat_bun'],
			lowestLevel: 'debug',
			sinks: ['console', 'otel'],
		},
	],
})
