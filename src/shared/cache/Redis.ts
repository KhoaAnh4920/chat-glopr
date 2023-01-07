import Redis from 'ioredis';

export const redisClient = new Redis({
  port: +process.env.REDIS_PORT, // Redis port
  host: process.env.REDIS_HOST, // Redis host
  username: process.env.REDIS_USERNAME, // needs Redis >= 6
  password: process.env.REDIS_PASSWORD,
});

// export const redisClient = new Redis(6379);
