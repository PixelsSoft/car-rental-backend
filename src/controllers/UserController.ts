import AsyncHandler from "../helpers/AsyncHandler";
import User, { IUserWithMethods } from "../models/User";
import ErrorHandler from "../helpers/ErrorHandler";
import sendEmail from "../helpers/SendEmail";
import * as crypto from "crypto";

export const createUser = AsyncHandler(async (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return next(new ErrorHandler("Passwords dont match!", 400));

  const user = (await User.create({
    fullName,
    email,
    password,
  })) as IUserWithMethods;

  const verificationToken = user.getEmailVerificationToken();

  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/email/verify/${verificationToken}`;

  const message = `Your Email verification token is as follows:\n\n${verificationUrl}\n\nIf you did not create account then ignore it.`;

  try {
    await sendEmail({
      email: user.email as string,
      subject: "Xpress Rental - Email Verification",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Verification sent to ${user.email}`,
    });
  } catch (error: any) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

export const verifyEmail = AsyncHandler(async (req, res, next) => {
  // Hash url token
  const emailVerificationToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new ErrorHandler("Email Verification token is invalid or expired", 400)
    );

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email Verified! You may log in now.",
  });
});

export const forgetPassword = AsyncHandler(async (req, res, next) => {
  const user = (await User.findOne({
    email: req.body.email,
  })) as IUserWithMethods;
  if (!user)
    return next(new ErrorHandler("User not found with this email", 404));
  //Get reset token:
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested password change then ignore it.`;

  try {
    await sendEmail({
      email: user.email as string,
      subject: "Xpress Rental - Password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email}`,
    });
  } catch (error: any) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = AsyncHandler(async (req, res, next) => {
  // Hash url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new ErrorHandler("Password reset token is invalid or expired", 400)
    );

  if (req.body.password !== req.body.confirmPassword)
    return next(new ErrorHandler("Password does not match", 400));

  //Setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    user,
    success: true,
  });
});

export const changePassword = AsyncHandler(async (req, res, next) => {});

export const login = AsyncHandler(async (req, res, next) => {});
