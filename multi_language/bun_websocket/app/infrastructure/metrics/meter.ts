import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
	MeterProvider,
	PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const exporter = new OTLPMetricExporter({
	url: 'http://localhost:4318/v1/metrics',
})

const metricReader = new PeriodicExportingMetricReader({
	exporter,
	exportIntervalMillis: 1000,
})

const meterProvider = new MeterProvider({
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: 'web_chat_bun_service',
	}),
	readers: [metricReader],
})

const Meter = meterProvider.getMeter('web_chat_bun')

export default Meter
