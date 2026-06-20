const { metrics } = require("@opentelemetry/api");

const meter = metrics.getMeter("hourairos");

const loginCounter = meter.createCounter(
  "hourairos_login_total",
  {
    description: "Total successful logins",
  }
);

const deploymentCounter = meter.createCounter(
  "hourairos_deployments_total",
  {
    description: "Total deployments",
  }
);

const paymentSuccessCounter = meter.createCounter(
  "hourairos_payment_success_total",
  {
    description: "Successful payments",
  }
);

const paymentFailedCounter = meter.createCounter(
  "hourairos_payment_failed_total",
  {
    description: "Failed payments",
  }
);

module.exports = {
  loginCounter,
  deploymentCounter,
  paymentSuccessCounter,
  paymentFailedCounter,
};