import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

@Injectable()
export class CacheRepository {
  constructor(
    private readonly redisClient: Redis, // protected config: any,
  ) {}

  public async setUserCache(key, value): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value));
  }

  public async getUserInCache(key) {
    const data = await this.redisClient.get(key);
    return JSON.parse(data);
  }

  public async handleJoin(userId): Promise<void> {
    const cachedUser = await this.getUserInCache(userId);
    if (cachedUser)
      await this.setUserCache(userId, {
        ...cachedUser,
        isOnline: true,
        lastLogin: null,
      });
    else {
      await this.setUserCache(userId, {
        isOnline: true,
        lastLogin: null,
      });
    }
  }

  public async handleLeave(userId): Promise<void> {
    const cachedUser = await this.getUserInCache(userId);
    if (cachedUser)
      await this.setUserCache(userId, {
        ...cachedUser,
        isOnline: false,
        lastLogin: new Date(),
      });
  }

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
      if (count < 100) {
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

  public async hgetall(key: string, beDeleted?: boolean) {
    const data = await this.redisClient.hgetall(key);
    if (beDeleted) {
      await this.del(key);
    }

    return data;
  }
}
