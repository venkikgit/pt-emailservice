// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express, { NextFunction, Request, Response } from 'express';

const app = express();

app.get('/', async (req: Request, res: Response) => {
    res.send('Welcome to NodeJS');
});
export default app;
