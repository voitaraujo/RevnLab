import express from 'express';
import cors from 'cors';
import "reflect-metadata"
import dotenv from 'dotenv'
import moment from 'moment'
import "moment/locale/pt-br";

import { Conn } from './services/dbConn'
import routes from './routes';

moment.locale("pt-br")
dotenv.config()
Conn()

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(routes);

app.listen(3305);
