import app from "./app";
import { PORT } from "./config";
import { redisClient } from "./lib/redis";

const startServer = async () => {
  try {
    await redisClient.connect();

    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      await redisClient.flushDb();
      console.log("Redis has been reset.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
