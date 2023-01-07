//import { IRole } from '../../role/role.type';

import { Types } from 'mongoose';

export interface ICurrentUser {
  readonly userId: string;
  // readonly role: IRole;
  // readonly externalId: string;
}
