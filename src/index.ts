import express, {Application, Request, Response} from "express" ;
import cors from 'cors';
import { initDb } from './database';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import playersRouter from './routes/players';
import teamsRouter from './routes/teams';
import matchesRouter from './routes/matches';

const PORT = process.env.PORT || 3000;

export const app: Application = express();

// Middleware
// Entry points for the Express app
app.use(cors({
    origin: [
        '*', // Allow all origins
        'http://localhost:8080', // Docker port
        'http://localhost:4200', // Angular development server
        'http://sports-management-system.s3-website-eu-west-1.amazonaws.com' // S3 bucket frontend
    ],
    credentials: true
}));
app.use(express.json());

// Routes
app.get("/ping", async (_req : Request, res: Response) => {
    res.json({
    message: "Football Management System API",
    });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/players', playersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/matches', matchesRouter);

// Initialize database and start server
const startServer = async () => {
    try {
        await initDb();
        app.listen(PORT, () => {
            console.log("Server is running on port", PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
    startServer();
}
