import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { identity } from 'rxjs';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { User, UserDocument } from 'src/_schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ICreateUserFromSocialViewReq,
  ICreateUserViewReq,
  IUser,
} from './user.type';
const ObjectId = require('mongoose').Types.ObjectId;

export class UsersRepository {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  async findOne(indentity: string): Promise<UserDocument | undefined> {
    const idParam = ObjectId.isValid(indentity);
    let user = null;
    if (idParam) {
      user = await this.userModel.findOne({
        _id: indentity,
      });
    } else {
      user = await this.userModel.findOne({
        $or: [
          { email: indentity },
          { phoneNumber: indentity },
          { userName: indentity },
        ],
      });
    }
    return user;
  }

  async createOne(
    user: ICreateUserViewReq | ICreateUserFromSocialViewReq,
  ): Promise<User> {
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

  public async checkByIds(ids: string[]) {
    for (const idEle of ids) {
      const user = await this.userModel.findOne({
        _id: idEle,
        isActived: true,
        isDeleted: false,
      });

      if (!user) throw new AppError(ERROR_CODE.USER_NOT_FOUND);
    }
  }
}
