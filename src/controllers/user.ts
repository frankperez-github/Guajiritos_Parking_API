import { Response } from 'express';
import User from '../models/Users';
import IUserRequest from '../types/UserRequest';
import bcrypt from 'bcrypt'

export const getAllUsers = async (req: IUserRequest, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

export const getUserById = async (req: IUserRequest, res: Response): Promise<void> => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

export const createUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const deleteUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

export const updateUser = async (req: IUserRequest, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findByPk(userId);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = hashedPassword || user.password;
    user.role = role || user.role;

    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};
