import Redis from 'ioredis';

// export const redisClient = new Redis({
//   host: 'containers-us-west-141.railway.app',
//   port: 6288,
//   password: '8X3DQmXuTMC0ALerI3pu',
// });

export const redisClient = new Redis({ host: 'redis' });
