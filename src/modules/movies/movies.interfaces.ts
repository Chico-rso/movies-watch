import {Request} from "express";

export interface SearchRequest extends Request {
	query:
		{
			searchTerm: string;
		}
}

export interface GetMovieFromIMDBRequest extends Request {
	params:
		{
			IMDBId: string;
		}
}

export interface CreateMovieRequest extends Request {
	body: Movie;
}

export interface UpdateMovieRequest extends Request {
	body: Partial<Movie>;
	params:
		{
			id: string;
		}
}

export interface DeleteMovieRequest extends Request {
	params:
		{
			id: string;
		}
}

export interface GetMovieRequest extends Request {
	params:
		{
			id: string;
		}
}

export interface Movie {
	title: string;
	magnet: string;
	fileName: string;
	sourceUrl: string;
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

export interface MovieCollection {
	id: number;
	name: string;
	poster_path: string;
	backdrop_path: string;
}

export interface Genre {
	id: number;
	name: string;
}

export interface ProductionCompany {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}

export interface ProductionCountry {
	iso_3166_1: string;
	name: string;
}

export interface SpokenLanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
}

export interface IMDBMovie {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: MovieCollection;
	budget: number;
	genres: Genre[];
	homepage: string;
	id: number;
	imdb_id: string;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: SpokenLanguage[];
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface CrewMember {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	credit_id: string;
	cast_id?: string;
	character?: string;
	department: string;
	job: string;
	order: number;
}

export interface GetCreditsResponse {
	id: number;
	cast: CrewMember[];
	crew: CrewMember[];
}

export interface SearchMoviesResponse {
	page: number
	results: Partial<IMDBMovie>[]
	total_pages: number
	total_results: number
}


