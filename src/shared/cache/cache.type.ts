import { ModuleMetadata } from '@nestjs/common';

export interface ICacheOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  db: number;
}

export interface ICacheConnectOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<ICacheOptions> | ICacheOptions;
  inject?: any[];
}
