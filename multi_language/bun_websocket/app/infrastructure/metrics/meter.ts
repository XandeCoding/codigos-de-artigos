import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
	MeterProvider,
	PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { getConfig } from '../config/config'

const exporter = new OTLPMetricExporter({
	url: `${getConfig().otlpHttpUrl}`,
})

const metricReader = new PeriodicExportingMetricReader({
	exporter,
	exportIntervalMillis: 5000,
})

const meterProvider = new MeterProvider({
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: 'web_chat_bun_service',
	}),
	readers: [metricReader],
})

const Meter = meterProvider.getMeter('web_chat_bun')

export default Meter
