import { ObjectId, Types } from 'mongoose';

export interface IResponseUpload {
  readonly secure_url: string;
  readonly created_at: Date;
}
