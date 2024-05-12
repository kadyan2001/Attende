import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.model';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async findByUserId(identifier: string) {
    const user = await this.userModel
      .findOne({ user_id: identifier })
      .lean()
      .exec();
    return user;
  }

  async getAbsentUsers(_presentIdsArray: []) {
    return this.userModel
      .find({ user_id: { $nin: _presentIdsArray } })
      .lean()
      .exec();
  }

  async signup(signupDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const userWithHashedPassword = { ...signupDto, password: hashedPassword };
    return await new this.userModel(userWithHashedPassword).save();
  }

  async updateCredentials(_id: string, signupDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const userWithHashedPassword = { ...signupDto, password: hashedPassword };
    return await this.userModel
      .findOneAndUpdate({ _id }, userWithHashedPassword, { new: true })
      .lean()
      .exec();
  }

  async getProfiles(_id?: string) {
    if (!_id) {
      return this.userModel.find().lean().exec();
    }
    return this.userModel.find({ _id }).lean().exec();
  }
}
