import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { identity } from 'rxjs';
import { User, UserDocument } from 'src/_schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './user.type';
const ObjectId = require('mongoose').Types.ObjectId;

export class UsersRepository {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  async findOne(indentity: string): Promise<IUser | undefined> {
    const idParam = ObjectId.isValid(indentity);
    let user = null;
    if (idParam) {
      user = await this.userModel.findOne(
        {
          _id: indentity,
        },
        { password: 0, refreshToken: 0 },
      );
    } else {
      user = await this.userModel.findOne(
        {
          $or: [
            { email: indentity },
            { phoneNumber: indentity },
            { userName: indentity },
          ],
        },
        { password: 0, refreshToken: 0 },
      );
    }
    return user;
  }

  async createOne(user): Promise<User> {
    const createOne = await this.userModel.create(user);
    return createOne;
  }
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
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

  public async getUserSummaryInfo(
    userName: string,
  ): Promise<UserDocument | undefined> {
    return this.userModel.findOne(
      { userName },
      '-_id userName fullName avatar isActived',
    );
  }

  public async getlistUser(key: string): Promise<UserDocument[]> {
    return this.userModel.find(
      {
        $or: [
          { fullName: { $regex: key, $options: 'i' } },
          { userName: { $regex: key, $options: 'i' } },
          { phoneNumber: { $regex: key, $options: 'i' } },
          // ...
        ],
      },
      '-_id email userName fullName avatar dob gender isActived',
    );
  }
}
