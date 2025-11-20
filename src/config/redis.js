import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
  },

});

redisClient.connect()
  .then(() => console.log("Redis connected"))
  .catch(err => console.error("Redis connection error:", err));

export { redisClient };
