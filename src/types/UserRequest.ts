import { Request } from 'express';

export default interface IUserRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'empleado' | 'cliente';
  };
}
