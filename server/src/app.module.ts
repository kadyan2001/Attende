import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AttendenceModule } from './modules/attendence/attendence.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.DB_URI),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    AttendenceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
