import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

@Injectable()
export class CacheRepository {
  constructor(
    private readonly redisClient: Redis, // protected config: any,
  ) {}

  public async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  public async checkKey(key: string, field: any): Promise<boolean> {
    const value = await this.redisClient.hgetall(key);
    return !!value[field];
  }
  public async checkSpam(key: string): Promise<boolean> {
    const value = await this.redisClient.hgetall(key);
    const count = parseInt(value.count);
    if (!!count) {
      if (count < 5) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
  public async increaseCount(key: string): Promise<number> {
    const value = await this.redisClient.hgetall(key);
    let count = parseInt(value.count);
    return (count += 1);
  }
  public async checkTimeSending(key: string): Promise<boolean> {
    const value = await this.redisClient.hgetall(key);
    const timeSending = parseInt(value.timeSending);
    dayjs.extend(utc);
    const now = dayjs().utc().valueOf();
    if (JSON.stringify(value) === JSON.stringify({})) {
      return true;
    }
    if (now - timeSending > 120000) {
      return true;
    } else {
      return false;
    }
  }

  public async set(key: string, args: string[]) {
    await this.redisClient.hmset(key, args);
  }

  public async setKeyToRedis(key: string, expTime: number, args: string[]) {
    await this.del(key);
    await this.redisClient.hmset(key, args);
    if (expTime) {
      await this.redisClient.expire(key, expTime);
    }
  }

  public async hgetall(key: string, beDeleted?: boolean): Promise<any> {
    const data = await this.redisClient.hgetall(key);
    if (beDeleted) {
      await this.del(key);
    }

    return data;
  }
}
