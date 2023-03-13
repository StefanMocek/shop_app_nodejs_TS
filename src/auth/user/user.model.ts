import mongoose from 'mongoose';
import {UserModel, UserDoc} from "@shop-app-package/common";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  password: {
    type:String,
    requried: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password
    },
  }
});

export const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
