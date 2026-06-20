const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION,
});

async function loadSecrets() {
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: "hourairos/dev/app-config",
    })
  );

  return JSON.parse(response.SecretString);
}

module.exports = { loadSecrets };