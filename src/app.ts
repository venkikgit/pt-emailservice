// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express, { NextFunction, Request, Response } from 'express';
import apiRoute from './routes/index.js';
const app = express();

app.use(express.json());
app.get('/', async (req: Request, res: Response) => {
    res.send('Welcome to NodeJS');
});

app.use('/api', apiRoute);
export default app;
