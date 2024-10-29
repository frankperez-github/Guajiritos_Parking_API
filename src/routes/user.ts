import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user';
import authenticate from '../middlewares/auth';
import isAdmin from '../middlewares/isAdmin';

const router = Router();

router.post('/', createUser);
router.get('/', authenticate, isAdmin, getAllUsers); 
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, isAdmin, updateUser);       
router.delete('/:id', authenticate, isAdmin, deleteUser);    

export default router;
