# Docker Compose - Observability made easy

Hello, JavaScript backend veterans! I bring you an observability stack based on OpenTelemetry, using VictoriaMetrics for metrics, VictoriaLogs for logs, and Jaeger for traces.

It's a stack focused on a development environment, but nothing prevents it from being used in a low-volume production application with some adjustments.

## Show me the code

This time I couldn't bring just a single Docker Compose YAML 😢, but it's only a little bit more, I promise 🙏.

### otel_config.yaml

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: :4317

exporters:
  otlp:
    endpoint: jaeger:4317
    tls:
      insecure: true

  otlphttp:
    logs_endpoint: http://victoria_logs:9428/insert/opentelemetry/v1/logs
    metrics_endpoint: http://victoria_metrics:8428/opentelemetry/v1/metrics
    tls:
      insecure: true

service:
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [otlphttp]

    metrics:
      receivers: [otlp]
      exporters: [otlphttp]

    traces:
      receivers: [otlp]
      exporters: [otlp]
```

This file is responsible for the OpenTelemetry Collector configuration.

It basically defines how we will receive our application data (receivers), allows us to add some processing (like compression and batching) if we want, and configures how data will be exported (exporters).

### datasources.yaml

```yaml
apiVersion: 1
datasources:
  - name: VictoriaMetrics
    type: victoriametrics-metrics-datasource
    access: proxy
    url: http://victoria_metrics:8428
    isDefault: true

  - name: VictoriaLogs
    type: victoriametrics-logs-datasource
    access: proxy
    url: http://victoria_logs:9428
    isDefault: false
```

We need this file to configure the Grafana datasources—in our case, the metrics and logs sources that will be used.

### docker-compose.yaml

```yaml
services:
  grafana:
    image: "grafana/grafana:12.3.3"
    volumes:
      - grafana:/var/lib/grafana
      - ./datasources.yaml:/etc/grafana/provisioning/datasources/datasources.yaml:ro
    networks:
      - monitoring 
    ports:
      - 3000:3000
    environment:
      GF_PLUGINS_PREINSTALL: victoriametrics-metrics-datasource,victoriametrics-logs-datasource
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin

  otlp_collector:
    image: "otel/opentelemetry-collector-contrib:0.145.0"
    volumes:
      - ./otel_config.yaml:/etc/otelcol/config.yaml:ro
    command: ["--config=/etc/otelcol/config.yaml"]
    ports:
      - 4317:4317
    networks:
      - monitoring 

  victoria_metrics:
    image: "victoriametrics/victoria-metrics:v1.135.0"
    volumes:
      - metrics:/victoria-metrics-data
    environment:
      storageDataPath: "victoria-metrics-data"
      retentionPeriod: "1d"
    networks:
      - monitoring 

  victoria_logs:
    image: "victoriametrics/victoria-logs:v1.45.0"
    volumes:
      - logs:/victoria-metrics-data
    environment:
      storageDataPath: "victoria-metrics-data"
      retentionPeriod: "1d"
    networks:
      - monitoring 

  jaeger:
    image: "cr.jaegertracing.io/jaegertracing/jaeger:2.15.0" 
    networks:
      - monitoring 
    ports:
      - 16686:16686
    environment:
      MEMORY_MAX_TRACES: 10000

volumes:
  grafana:
  metrics:
  logs:

networks:
  monitoring:
```

Here is where the fun begins. I don't think it's worth going into too much detail because everything can be found better explained elsewhere than a mere mortal like me could do, so I'll just leave a few points of attention:

- Logs and metrics will be exposed by Grafana on port 3000. So, by connecting to localhost:3000 and using the credentials set in the YAML, you'll have access to them.

- Traces will be exposed similarly, but the Jaeger tool uses port 16686.

- This Jaeger instance was configured without persistence, so upon restarting the container, previously ingested traces will be lost. In case you want an easy way to add persistence, you can use [Badger](https://www.jaegertracing.io/docs/2.15/storage/badger/) as a Storage Backend.

### Arrivederci

Until later, my friends! I hope this article is useful in your journey to spin up OTLP locally.

That's all! In case you have any doubts or suggestions, just let me know. I'll be happy to answer!
