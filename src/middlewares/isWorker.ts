import { Response, NextFunction } from 'express';
import IUserRequest from "../types/UserRequest"

const isWorker = (req: IUserRequest, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'empleado' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Workers only' });
  }
};

export default isWorker;
