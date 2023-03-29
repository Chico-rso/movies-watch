import { Router } from "express";
import {CreateMovieRequest, SerachRequest,} from "./movies.interfaces";
import * as movieService from "./movies.service";


const router = Router();



router.get('/search', async ({ query: { searchTerm } }: SerachRequest, res) => {
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
