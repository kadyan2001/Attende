import { Schema } from 'mongoose';

export const AttendenceSchema = new Schema(
  {
    user: {},
    out_time: {},
    status: {
      type: String,
      enum: ['present', 'absent'],
      default: 'present',
    },
  },
  { timestamps: true },
);
