import express from 'express';
import cors from 'cors';
import "reflect-metadata"
import dotenv from 'dotenv'

import { Conn } from './services/dbConn'
import routes from './routes';

dotenv.config()
Conn()

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(routes);

app.listen(process.env.SERVER_PORT);
