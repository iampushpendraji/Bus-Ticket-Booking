import dotenv from 'dotenv';
import { connect_db } from './db/connect_db';
import { app } from './app';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8000;

// Connecting to MySQL
connect_db()
    .then(() => {
        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MySQL db connection failed !! ', err);
    });
