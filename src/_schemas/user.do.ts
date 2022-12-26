import { Types } from 'mongoose';

export class UserDo {
  _id: Types.ObjectId;
  email: string;
  password: string;
  fullName: string;
  userName: string;
  phoneNumber: string;
  dob: Date;
  avatar: string;

  constructor(props: Partial<UserDo>) {
    this._id = props._id;
    this.email = props.email || null;
    this.password = props.password || null;
    this.fullName = props.fullName || null;
    this.userName = props.userName || null;
    this.phoneNumber = props.phoneNumber || null;
    this.dob = props.dob || null;
    this.avatar = props.avatar || null;
  }
}
