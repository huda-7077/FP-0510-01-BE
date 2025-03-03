import * as redis from "redis";

export const redisClient = redis.createClient({
  url: "redis://localhost:6379",
});
