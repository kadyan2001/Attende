import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    user_id: { type: String },
    email: { type: String },
    name: { type: String },
    team: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true },
);
