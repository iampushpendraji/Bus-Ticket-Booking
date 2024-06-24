import mysql, { Pool } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// Define MySQL database connection options
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
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.release(); // Release the connection back to the pool
      resolve();
    });
  });
};

export { connectDB, pool };
