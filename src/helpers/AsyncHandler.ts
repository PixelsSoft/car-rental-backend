import { NextFunction, Request, Response } from "express";

const AsyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => {}) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(handler(req, res, next)).catch(next);

export default AsyncHandler;
