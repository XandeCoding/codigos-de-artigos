import { trace } from '@opentelemetry/api'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
	BatchSpanProcessor,
	NodeTracerProvider,
} from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { getConfig } from '../config/config'

const exporter = new OTLPTraceExporter({
	url: `${getConfig().otlpHttpUrl}`,
})
const provider = new NodeTracerProvider({
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: 'web_chat_bun_service',
	}),
	spanProcessors: [new BatchSpanProcessor(exporter)],
})

provider.register()

const Tracer = trace.getTracer('web_chat_bun')

export default Tracer
