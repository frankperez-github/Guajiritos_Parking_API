import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import sequelize from './config/database';
import logsRouter from './routes/logs';
import usersRouter from './routes/user';
import parkingRouter from './routes/parking';
import authRouter from './routes/auth';
import initializeParkingSpots from './utils/InitParking';
import setupAssociations from './models/InitAssociations';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setupAssociations();

app.use('/api/logs', logsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/parking', parkingRouter);


export const initializeDatabase = async (test: boolean) => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('MongoDB connected for logs');

    await sequelize.authenticate();
    console.log('PostgreSQL database connected successfully');

    await sequelize.sync({ force: test });
    console.log('Database synchronized successfully');

    await initializeParkingSpots(100);
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
  }
};


const startServer = async (test:boolean) => {
  await initializeDatabase(test);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if(process.env.NODE_ENV !== 'test')
{
  startServer(false);
}

export default app;
