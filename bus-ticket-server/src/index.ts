import dotenv from 'dotenv';
import { connectDB } from './db/connectDB';
import { app } from './app';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8000;

// Connecting to MySQL
connectDB()
    .then(() => {
        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MySQL db connection failed !! ', err);
    });
