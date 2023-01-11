import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { CACHE_OPTIONS } from './cache.constant';
import { CacheRepository } from './cache.repository';
import { ICacheConnectOptions, ICacheOptions } from './cache.type';
import { redisClient } from './redis';

@Global()
@Module({})
export class CacheModule {
  static forRoot(options: ICacheConnectOptions): DynamicModule {
    const asyncProviders = this.createCacheProviders(options);
    return {
      imports: options.imports,
      providers: [
        ...asyncProviders,
        {
          provide: CacheRepository,
          useFactory: (config: ICacheOptions) => {
            // const redisClient = new Redis({
            //   host: config.host,
            //   port: config.port,
            //   username: config.user,
            //   password: config.password,
            //   db: config.db,
            // });
            return new CacheRepository(redisClient);
          },
          inject: [CACHE_OPTIONS, ...(options.inject || [])],
        },
      ],
      exports: [CacheRepository],
      module: CacheModule,
    };
  }

  private static createCacheProviders(
    options: ICacheConnectOptions,
  ): Provider[] {
    return [
      {
        provide: CACHE_OPTIONS,
        useFactory() {
          options.useFactory || [];
        },
        inject: options.inject || [],
      },
    ];
  }
}
