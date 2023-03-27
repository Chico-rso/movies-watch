import { Request } from "express";

export interface SerachRequest extends Request
{
	query:
		{
			searchTerm: string;
		}
}

export interface Movie
{
	title: string;
	plot: string;
	year: string;
	director: string;
	actors: string[];
	poster: string;
	trailer: string;
	_id?: string;
	boxOffice: string;
	released: string;
	writer: string;
	runTime: string;
	ratingImdb: string;
	imdbId: string;
	rated: string;
	genres: string[];
}
