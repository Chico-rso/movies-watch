import {stringify} from "qs";
import axios from "axios";
import {IMDB_SEARCH_URL} from "./movies.const";
import * as process from "process";
import {IMDBMovie} from "./movies.interfaces";

export const searchInIMDB = async (query: string): Promise<Partial<IMDBMovie>> => {
	const queryParams = stringify({
		lang: "ru",
		api_key: process.env.IMDB_API_KEY,
		query
	})
	const { data: {results} } = await axios.get(`${IMDB_SEARCH_URL}/search/movie?${queryParams}`)
	const [movie] = results;
	return movie;
}

export const getMovieFromIMDB = async (IMDBId: string): Promise<IMDBMovie> => {
	const queryParams = stringify({
		lang: "ru",
		api_key: process.env.IMDB_API_KEY,
	})
	const result = await axios.get(`${IMDB_SEARCH_URL}/movie/${IMDBId}?${queryParams}`)
	return result.data;
}
