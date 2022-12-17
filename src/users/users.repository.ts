import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/_schemas/user.schema';

export class UsersRepository {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  async findOne(email): Promise<any> {
    const findOne = await this.userModel.findOne({ email: email });
    return findOne;
  }

  async createOne(user): Promise<any> {
    const createOne = await this.userModel.create(user);
    return createOne;
  }
}
