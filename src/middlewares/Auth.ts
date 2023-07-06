import AsyncHandler from "../helpers/AsyncHandler";
import ErrorHandler from "../helpers/ErrorHandler";
import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUserWithMethods } from "../models/User";

interface IAuthenticatedRequest extends Request {
  user?: IUserWithMethods | null | undefined;
}

export const isAuthenticated = AsyncHandler(
  async (req: IAuthenticatedRequest, res, next) => {
    const { token } = req.cookies;

    if (!token)
      return next(new ErrorHandler("Login to access this resource.", 401));

    if (process.env.JWT_SECRET) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as jwt.JwtPayload;

      req.user = await User.findById(decoded._id);
    }

    next();
  }
);

// Handling users roles
export const authorizeRoles = (...roles: any) => {
  return (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
