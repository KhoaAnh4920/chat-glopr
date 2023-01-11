import Redis from 'ioredis';

console.log('Check: ', process.env.REDIS_HOST);
export const redisClient = new Redis({
  host: 'redis-19300.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
  port: 19300,
  password: 'c1X5kKMlrRWK8b5vJv6WDLqSrYmtatQZ',
});

// export const redisClient = new Redis(6379);
