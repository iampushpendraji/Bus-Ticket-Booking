import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import health_check_router from './routes/health_check.routes';
import user_router from './routes/user.routes';


// Initialize Express application
const app: Express = express();


// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Adjust as needed for your CORS configuration
  credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());


// Routes
app.use('/api/v1/health_check', health_check_router);
app.use('/api/v1/user', user_router);


// Example route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my TypeScript Express application');
});


export { app };