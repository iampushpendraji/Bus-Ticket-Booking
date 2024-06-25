import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// MySQL database connection options from environment variables
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USR,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create a connection pool
const pool: Pool = mysql.createPool(dbConfig);

// Function to establish database connection
const connectDB = (): Promise<void> => {
  return new Promise(async (res, rej) => {
    try {
      const connection: PoolConnection = await pool.getConnection();
      connection.release();
      res();
    }
    catch(err) {
      rej(err);
    } 
  })
};

export { connectDB, pool };