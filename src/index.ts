import app from "./app";
import { PORT } from "./config";
import { redisClient } from "./lib/redis";

const startServer = async () => {
  try {
    await redisClient.connect();

    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit the process if there's an error
  }
};

startServer();
