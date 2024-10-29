import sequelize from './src/config/database';
import mongoose from 'mongoose';
import {initializeDatabase} from "./src/app"

beforeAll(async () => {
     await initializeDatabase(true)
  }, 50000);
  

afterAll(async () => {
  await sequelize.close();
  await mongoose.connection.close();
}, 50000);
