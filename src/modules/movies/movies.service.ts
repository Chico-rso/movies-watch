import axios from "axios";
import * as cheerio from "cheerio";
import {BASE_SEARCH_URL, IMDB_SEARCH_URL, TORRENT_URL} from "./movies.const";
import {extractMagnetFromQuery} from "./movies.util";
import { stringify } from "qs";
import MovieEntity from "./movies.model";
import {Movie} from "./movies.interfaces";
import * as process from "process";


export const movieSearch = async (searchTerm: string) => {
	const searchResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`)
	const $ = cheerio.load(searchResult.data);

	const data = $("#index tr").toArray();
	return data
		.map((item) => {
			const [_, magnetTeg, title] = $(item).find("a").toArray();
			const magnetLink = $(magnetTeg).attr("href");
			const torrentUrl = `${TORRENT_URL}${$(title).attr("href")}`;

			return ({
				magnet: extractMagnetFromQuery(magnetLink),
				title: $(title).text(),
				torrentUrl
			});
		}).filter((item) => item.title);
}

export const searchInImdb = async (query: string) => {
	const queryParams = stringify({
		lang: "ru",
		api_key: process.env.IMDB_API_KEY,
		query
	})
	const { data: {results} } = await axios.get(`${IMDB_SEARCH_URL}/search/movie?${queryParams}`)
	const [movie] = results;
	return movie;
}

export const create = async (input: Movie) => {
	const item = new MovieEntity(input)
	await item.save();
	return item;
}
export const update = (input: Partial<Movie>, id: String) => {
	return MovieEntity.findByIdAndUpdate(id, input, {
		new: true
	})
}
export const findOne = (id: String) => {
	return MovieEntity.findById(id)
}
export const findAll = () => {
	return MovieEntity.find();
}
export const deleteOne = (id: String) => {
	return MovieEntity.findByIdAndRemove(id);
}
