import { app } from "main/app";

import { appConfig } from "main/utils/environment/AppConfig";

const PORT = appConfig.port;

async function start(): Promise<void> {
  app.listen(PORT, () => {
    console.log(`Server Listening on Port: ${PORT}`);
  });
}

start()
  .then(async () => {})
  .catch(async (err: Error) => {
    console.log("Error Caught by start().catch(): ", err);
    process.exit(1);
  });
