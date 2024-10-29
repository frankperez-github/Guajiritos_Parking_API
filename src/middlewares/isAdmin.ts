import { Response, NextFunction } from 'express';
import IUserRequest from '../types/UserRequest';

const isAdmin = (req: IUserRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Workers only' });
  }
};

export default isAdmin;
