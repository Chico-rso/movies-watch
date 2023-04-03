import { Router } from "express";
import * as movieService from "./movies.service";
import * as IMDBService from "./imdb.service";

import {CreateMovieRequest, SearchRequest,} from "./movies.interfaces";


const router = Router();



router.get('/search', async ({ query: { searchTerm } }: SearchRequest, res) => {
try
{
	const results = await movieService.movieSearch(searchTerm);
	res.status(200).send(results);
}
catch(error)
{
	res.status(400).send(error);
	console.log(error);
}
});

router.get('/imdb-search', async ({ query: { searchTerm } }: SearchRequest, res) => {
try
{
	const results = await IMDBService.searchInIMDB(searchTerm);
	res.status(200).send(results);
}
catch(error)
{
	res.status(400).send(error);
	console.log(error);
}
});

router.get('/imdb/:IMDBId', async ({ params: { IMDBId } }: SearchRequest, res) => {
try
{
	const results = await IMDBService.getMovieFromIMDB(IMDBId);
	res.status(200).send(results);
}
catch(error)
{
	res.status(400).send(error);
	console.log(error);
}
});

router.post('/', async ({ body }: CreateMovieRequest, res) => {
try
{
	const result = await movieService.create(body);
	res.status(200).send(result);
}
catch(error)
{
	res.status(400).send(error);
	console.log(error);
}
});

router.get('/', async (_, res) => {
try
{
	const results = await movieService.findAll();
	res.status(200).send(results);
}
catch(error)
{
	res.status(400).send(error);
	console.log(error);
}
});
export default router;
