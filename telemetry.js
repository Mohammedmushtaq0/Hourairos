const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

const prometheusExporter = new PrometheusExporter(
  {
    port: 9464,
  },
  () => {
    console.log("Prometheus metrics available at:");
    console.log("http://localhost:9464/metrics");
  }
);

const traceExporter = new OTLPTraceExporter({
  url:
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
    "http://otel-collector:4318/v1/traces",
});

const sdk = new NodeSDK({
  metricReader: prometheusExporter,
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();