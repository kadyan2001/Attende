import { Module } from '@nestjs/common';
import { AttendenceController } from './attendence.controller';
import { AttendenceService } from './attendence.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendenceSchema } from './schemas/attendence.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'attendences', schema: AttendenceSchema },
    ]),
    UserModule,
  ],
  controllers: [AttendenceController],
  providers: [AttendenceService],
})
export class AttendenceModule {}
