import { InjectModel } from '@nestjs/mongoose';
import { UpdateResult } from 'mongodb';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/_schemas/user.schema';
import {
  UserSocialToken,
  UserSocialTokenDocument,
} from 'src/_schemas/user_socialtoken';
import { AppError, ERROR_CODE } from 'src/shared/error';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ICreateSocialTokenViewReq,
  ICreateUserFromSocialViewReq,
  ICreateUserViewReq,
} from './user.type';
const ObjectId = require('mongoose').Types.ObjectId;

export class UsersRepository {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,

    @InjectModel('UserSocialToken')
    private userSocialTokenModel: Model<UserSocialTokenDocument>,
  ) {}

  async findOne(indentity: string): Promise<UserDocument | undefined> {
    const idParam = ObjectId.isValid(indentity);
    let user = null;
    if (idParam) {
      user = await this.userModel.findOne({ _id: indentity }).lean();
    } else {
      user = await this.userModel
        .findOne({
          $or: [
            { email: indentity },
            { phoneNumber: indentity },
            { userName: indentity },
          ],
        })
        .lean();
    }

    if (user) {
      user.id = user._id.toString();
      delete user._id;
    }

    return user;
  }

  public async findOneSocialToken(
    socialId: string,
    type: string,
  ): Promise<any> {
    return this.userSocialTokenModel.findOne({
      socialId: socialId,
      type: type,
    });
  }

  async createOne(
    user: ICreateUserViewReq | ICreateUserFromSocialViewReq,
  ): Promise<User> {
    const createOne = await this.userModel.create(user);
    return createOne;
  }

  async createOneSocialToken(
    newSocialToken: ICreateSocialTokenViewReq,
  ): Promise<UserSocialToken> {
    const createOne = await this.userSocialTokenModel.create(newSocialToken);
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

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { lastLogin: new Date() }, { new: true })
      .exec();
  }

  async updateSocialToken(
    id: string,
    accessToken: string,
    refresh_token: string,
  ): Promise<UpdateResult> {
    return this.userSocialTokenModel
      .updateOne(
        { _id: id },
        { $set: { accessToken: accessToken, refreshToken: refresh_token } },
      )
      .exec();
  }

  public async findUserWithEmailOrPhone(
    identity: string,
    // email: string,
    // phoneNumber: string,
  ): Promise<User | undefined> {
    return this.userModel.findOne({
      $or: [{ email: identity }, { phoneNumber: identity }],
    });
  }

  public async getUserSummaryInfo(
    userName: string,
  ): Promise<UserDocument | undefined> {
    return this.userModel.findOne(
      { userName },
      'id userName fullName avatar isActived',
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
      'id email userName fullName avatar dob gender isActived',
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
