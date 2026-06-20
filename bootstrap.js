require("dotenv").config();

const { loadSecrets } = require("./services/secretService");

async function bootstrap() {
  try {
    const secrets = await loadSecrets();

    Object.assign(process.env, secrets);

    console.log("Secrets loaded successfully");

    require("./server");

  } catch (err) {
    console.error("Failed to load secrets");
    console.error(err);
    process.exit(1);
  }
}

bootstrap();