import { Request, Response } from 'express';
import Log from '../models/Logs';

export const createLog = async (req: Request, res: Response) => {
  const { action, userId, details } = req.body;
  try {
    const log = new Log({ action, userId, details });
    await log.save();
    res.status(201).json({ message: 'Log created successfully', log });
  } catch (error) {
    res.status(500).json({ message: 'Error creating log', error });
  }
};

export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const logs = await Log.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error });
  }
};