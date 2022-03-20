// Dependencies
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import helmet from "helmet";
import pg from 'pg';
import bodyParser from "body-parser";

// Configure app
dotenv.config();
const app = express();
app.use(bodyParser.json())
app.use(cors());
app.use(helmet());

// Check if all environment variables are set
if (!process.env.DB_USER) throw new Error('DB_USER environment variable is not set');
if (!process.env.DB_NAME) throw new Error('DB_NAME environment variable is not set');
if (!process.env.DB_PASSWORD) throw new Error('DB_PASSWORD environment variable is not set');
if (!process.env.DB_HOST) throw new Error('DB_PASSWORD environment variable is not set');
if (!process.env.DB_PORT) throw new Error('DB_PORT environment variable is not set');
if (!process.env.WS_PORT) throw new Error('WS_PORT environment variable is not set');
if (!process.env.EMAIL) throw new Error('EMAIL environment variable is not set');
if (!process.env.EMAIL_PASSWORD) throw new Error('EMAIL environment variable is not set');
if (!process.env.EMAIL_DESTINATION) throw new Error('EMAIL_DESTINATION environment variable is not set');
if (!process.env.AUTH_WAIT_TIME) throw new Error('AUTH_WAIT_TIME environment variable is not set');
if (!process.env.AUTH_VALID_TIME) throw new Error('AUTH_VALID_TIME environment variable is not set');

// Setup database from environment variables
const pool = new pg.Pool({
    user: process.env.DB_USER,              // Database user (defaults to postgres)
    host: process.env.DB_HOST,              // Database host (defaults to localhost)
    database: process.env.DB_NAME,          // Database name (defaults to gxinventory_db)
    password: process.env.DB_PASSWORD,      // Database user password
    port: parseInt(process.env.DB_PORT!)    // Database port (defaults to 5432)
});

// Initialize the backup script
try {
    require('./helpers/backup').initBackup();
} catch (err : any) {
    console.log(err);
}

// Load routes
require('./routes')({ app, pool });

// Start webserver on specified port
app.listen(process.env.WS_PORT, () => {
    console.log("Server started on port " + process.env.WS_PORT);
});