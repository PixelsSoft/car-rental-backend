import mongoose, { Document } from "mongoose";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

import validator from "validator";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  role: "admin" | "user";
  profilePic: {
    url: string;
    path: string;
  };
  email: mongoose.SchemaDefinitionProperty<string> | undefined;
  password: string;
  isVerified: boolean;
  _createdAt: Date;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: Date | undefined;
  emailVerificationToken: string | undefined;
  emailVerificationExpire: Date | undefined;
}

export interface IUserWithMethods extends IUser {
  comparePassword(password: string): Promise<boolean>;
  generateJwtToken(): string | undefined;
  getResetPasswordToken(): string;
  getEmailVerificationToken(): string;
}

const UserSchema = new mongoose.Schema<IUser, IUserWithMethods>({
  fullName: {
    type: String,
    required: [true, "Name is required"],
  },
  role: {
    type: String,
    default: "user",
  },
  profilePic: {
    url: {
      type: String,
      default:
        "https://miro.medium.com/v2/resize:fit:720/1*_ARzR7F_fff_KI14yMKBzw.png",
    },
    path: {
      type: String,
      default: "",
    },
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email already exists"],
    validate: [validator.isEmail, "Wrong email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password should be minimum 6 characters long"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  _createdAt: {
    type: Date,
    default: new Date(),
  },
});

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password as string, 10);
});

UserSchema.methods.generateJwtToken = function () {
  return (
    process.env.JWT_SECRET &&
    jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    })
  );
};

UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  //generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; //Expires in 30 minutes.

  return resetToken;
};

UserSchema.methods.getEmailVerificationToken = function () {
  //generate Token
  const verificationToken = crypto.randomBytes(20).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  //Set token expire time
  this.emailVerificationExpire = Date.now() + 30 * 60 * 1000; //Expires in 30 minutes.

  return verificationToken;
};

const User = mongoose.model("User", UserSchema);

export default User;
