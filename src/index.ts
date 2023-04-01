import 'module-alias/register';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import Router from '@/router';
import { createTheRedisClient } from './lib/redis';
dotenv.config();

const PORT = process.env.SERVER_PORT || 8000;
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(Router);

createTheRedisClient();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
