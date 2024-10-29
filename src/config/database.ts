import { Sequelize } from 'sequelize';
import dbConfig from './config';

const sequelize = new Sequelize(
    dbConfig.dbName,
    dbConfig.dbUser,
    dbConfig.dbPassword,
    {
        dialect: 'postgres',
        host: dbConfig.dbHost,      
        logging: false
    }
);


export default sequelize;