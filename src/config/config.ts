import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const config = {
  dbHost: process.env.DB_HOST || '',
  dbName: process.env.DB_NAME || '',
  dbUser: process.env.DB_USER || '',
  dbPassword: process.env.DB_PASSWORD || '',
  mongoURI: process.env.MONGO_URI || '',
  jwtToken: process.env.JWT_SECRET || ''
};

export default config;
