import * as redis from "redis";
import { REDIS_URL } from "../config";

export const redisClient = redis.createClient({
  url: REDIS_URL,
});
