import { createHash } from 'crypto';

const UPPER_STRING_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER_STRING_POOL = 'abcdefghijklmnopqrstuvwxyz';
const RANDOM_STRING_POOL = UPPER_STRING_POOL + LOWER_STRING_POOL;
const RANDOM_NUMBER_POOL = '0123456789';

export enum RandomTypes {
  STRING_ONLY = 'STRING_ONLY',
  NUMBER_ONLY = 'NUMBER_ONLY',
  STRING_NUMBER = 'STRING_NUMBER',
  UPPER_ONLY = 'UPPER_ONLY',
  LOWER_ONLY = 'LOWER_ONLY',
}

export class StringUtils {
  public static md5(input: string): string {
    return createHash('md5').update(input).digest('hex');
  }

  public static randomString(length: number, randomType: RandomTypes): string {
    let pool: string;
    switch (randomType) {
      case RandomTypes.STRING_ONLY:
        pool = RANDOM_STRING_POOL;
        break;
      case RandomTypes.NUMBER_ONLY:
        pool = RANDOM_NUMBER_POOL;
        break;
      case RandomTypes.UPPER_ONLY:
        pool = UPPER_STRING_POOL;
        break;
      case RandomTypes.LOWER_ONLY:
        pool = LOWER_STRING_POOL;
        break;
      default:
        pool = RANDOM_STRING_POOL + RANDOM_NUMBER_POOL;
    }

    let rand = '';

    for (let i = 0; i < length; i++) {
      rand += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    return rand;
  }
}
