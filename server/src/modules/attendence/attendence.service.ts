import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendence } from './models/attendence.model';
import { UserService } from '../user/user.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AttendenceService {
  constructor(
    @InjectModel('attendences')
    private readonly attendenceModel: Model<Attendence>,
    private readonly userService: UserService,
  ) { }

  @Cron('0 20 * * *')
  async handlePerDayAttendence(): Promise<void> {
    const attendences: any = await this.getAttendences();
    const _presentIdsArray: any = [];
    attendences.forEach((attendence) => {
      _presentIdsArray.push(attendence?.user?.user_id);
    });
    const absentUsers = await this.userService.getAbsentUsers(_presentIdsArray);
    absentUsers.forEach(async (user) => {
      const attendencePayload = {
        user_id: user.user_id,
        user: user,
        status: 'absent',
      };
      await this.addAttendence(attendencePayload);
    });
  }

  async getAttendences(user?: any) {
    if (user?.role === 'admin') {
      return this.attendenceModel.find().exec();
    } else {
      return this.attendenceModel.find({ 'user.user_id': user?._id }).exec();
      // // Get the start and end of the present day
      // const startOfDay = new Date();
      // startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

      // const endOfDay = new Date();
      // endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

      // // Find attendances created between start and end of the present day
      // return this.attendenceModel
      //   .find({
      //     createdAt: { $gte: startOfDay, $lte: endOfDay },
      //   })
      //   .exec();
    }
  }

  async addAttendence(payload: any) {
    const userInfo = await this.userService.findByUserId(payload.user_id);
    if (!userInfo) {
      throw new NotFoundException('User not found');
    }
    // Check if a document exists within the past 24 hours
    const existingAttendence = await this.attendenceModel.findOne({
      'user.user_id': payload.user_id,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    if (existingAttendence) {
      if (existingAttendence.status === 'absent') {
        throw new NotFoundException('Sorry you are absent today!');
      }
      // If the document exists, update it
      const result = await this.attendenceModel.findOneAndUpdate(
        { _id: existingAttendence._id },
        { $set: { out_time: new Date() } },
        { new: true },
      );
      return result;
    } else {
      // If the document does not exist, create a new one
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...restUser } = userInfo;
      const modifiedPayload = { user: restUser, ...payload };
      const newAttendence = new this.attendenceModel(modifiedPayload);
      const result = await newAttendence.save();
      return result;
    }
  }
}
