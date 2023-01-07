import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/_schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './user.type';
const ObjectId = require('mongoose').Types.ObjectId;

export class UsersRepository {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  async findOne(indentity): Promise<IUser | undefined> {
    const idParam = ObjectId.isValid(indentity);
    let findOne = null;
    if (idParam) {
      findOne = await this.userModel.findOne({
        _id: indentity,
      });
    } else {
      findOne = await this.userModel.findOne({
        $or: [{ email: indentity }, { phoneNumber: indentity }],
      });
    }
    return findOne;
  }

  async createOne(user): Promise<User> {
    const createOne = await this.userModel.create(user);
    return createOne;
  }
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  public async findUserWithEmailOrPhone(
    email: string,
    phoneNumber: string,
  ): Promise<User | undefined> {
    return this.userModel.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });
  }
}
