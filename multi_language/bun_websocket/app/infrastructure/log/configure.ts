import { configure, getConsoleSink } from "@logtape/logtape"
import { getOpenTelemetrySink } from "@logtape/otel"

await configure({
  sinks: { 
    console: getConsoleSink(),
    otel: getOpenTelemetrySink({
      serviceName: "oltp_service",
      otlpExporterConfig: {
        url: "http://localhost:4318/v1/logs", // TODO: PUT ENV
      },
      diagnostics: true, // TODO: PUT ENV
    }),
  },
  loggers: [
    {
      category: ["logtape", "meta"],
      sinks: ["console", "otel"],
      lowestLevel: "warning",
    },
    {
      category: ["web_chat_bun"],
      lowestLevel: "debug",
      sinks: ["console", "otel"],
    },
  ],
});
