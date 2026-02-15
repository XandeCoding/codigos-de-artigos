# Docker Compose - Stack de Observabilidade sem complicação

Olá, veteranos do JavaScript no backend! Trago para vocês uma stack de observabilidade baseada em OpenTelemetry, usando VictoriaMetrics para métricas, VictoriaLogs para logs e Jaeger para Traces.

É uma stack focada em ambiente de desenvolvimento, mas nada impede que, com alguns ajustes, possa ser usada em uma aplicação em produção de baixo volume.

## Show me the code

Dessa vez não vai dar para ser só um YAML de docker compose 😢, mas é pouca coisa a mais, prometo 🙏.

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

Esse arquivo é responsável pela configuração do Collector do OpenTelemetry. 

Ele basicamente define como devemos receber os dados da nossa aplicação (receivers), adiciona alguns processamentos (como compressão e batch) se quisermos, e configura para onde os dados serão exportados (exporters).

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

Precisamos desse arquivo para configurarmos a fontes de informações do grafana, no caso as fontes de métricas e logs que vão ser utilizadas.

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

Aqui é onde a brincadeira começa, não acho que vale muito entrar em detalhes porque tudo pode ser achado de uma forma muito melhor explicada que um mero mortal como eu faria, então vou só deixar alguns pontos de atenção.

- Logs e métricas vão ser expostas pelo grafana que está na porta 3000, logo entrando em localhost:3000 e colocando as senhas que estão explicitadas no yaml, você terá acesso a eles.

- Traces vão estar expostos de forma parecida mas na ferramenta do Jaeger na porta 16686.

- O Jaeger foi configurado sem persistência, então ao reiniciar o container os traces ingeridos vão ser perdidos, caso queira uma forma fácil de adicionar persistência pode usar o [Badger](https://www.jaegertracing.io/docs/2.15/storage/badger/) como Storage Backend.

### Arrivederci

Até mais meus caros espero ter sido útil na jornada de subir um oltp localmente.

É isso, caso tenham alguma dúvida ou sugestão basta me avisar. Ficarei feliz em responder!.
