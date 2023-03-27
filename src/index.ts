import express from 'express';
import * as process from "process";
import cors from 'cors';
import logger from 'morgan';
import * as mongoose from "mongoose";

//router
import streamRouter from "./modules/stream/stream.controller";
import contentRouter from "./modules/content/content.controller";
import moviesRouter from "./modules/movies/movies.controller";

import 'dotenv/config'

try
{
	console.log(process.env.MONGO_URL)

	mongoose.connect(process.env.MONGO_URL).then(() =>
	{
		console.log("connection to mongodb successful");
	});
}
catch (error)
{
	console.warn(error, "connection to mongodb failed");
	throw error;
}

// middleware
const app = express(); // Create a new express app instance
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

//endpoints
app.use('/stream', streamRouter);
app.use('/content', contentRouter);
app.use('/movies', moviesRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
{
	console.log('Starting streaming');
	console.log(`http://localhost:${PORT}`);
});
