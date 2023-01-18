import Redis from 'ioredis';

// console.log('Check: ', process.env.REDIS_HOST);
export const redisClient = new Redis({
  host: 'containers-us-west-141.railway.app',
  port: 6288,
  password: 'l8l0w0sjzEqmLQw5vleR',
});

// export const redisClient = new Redis({ host: 'redis' });
