import { configure, getConsoleSink } from '@logtape/logtape'
import { getOpenTelemetrySink } from '@logtape/otel'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
	BatchLogRecordProcessor,
	LoggerProvider,
} from '@opentelemetry/sdk-logs'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { getConfig } from '../config/config'

const exporter = new OTLPLogExporter({
	url: `${getConfig().otlpHttpUrl}`,
})
const loggerProvider = new LoggerProvider({
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: 'web_chat_bun_service',
	}),
	processors: [new BatchLogRecordProcessor(exporter)],
})

await configure({
	sinks: {
		console: getConsoleSink(),
		// biome-ignore lint/suspicious/noTsIgnore: function expected in logtape does not exist
		// @ts-ignore
		otel: getOpenTelemetrySink({ loggerProvider }),
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
