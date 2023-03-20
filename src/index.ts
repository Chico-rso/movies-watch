import express from 'express';
import * as process from "process";
import cors from 'cors';
import logger from 'morgan';

//router
import router from "./modules/stream/stream.controller";

const app = express(); // Create a new express app instance
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use('/stream', router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
{
    console.log('Starting streaming');
    console.log(`http://localhost:${PORT}`);
});
