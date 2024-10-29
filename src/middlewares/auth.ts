// middlewares/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import IUserRequest from '../types/UserRequest';

interface UserPayload {
  id: string;
  role: 'admin' | 'empleado' | 'cliente';
}



const authenticate = (req: IUserRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(403).json({ message: "Access Denied: No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtToken) as UserPayload;

    if (!decoded.id || !decoded.role) {
      res.status(400).json({ message: "Invalid Token: Missing id or role" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error:any) {
    res.status(400).json({ message: "Invalid Token", error: error.message });
    return;
  }
};

export default authenticate;
