import axios from "axios";
import * as cheerio from "cheerio";
import {BASE_SEARCH_URL, TORRENT_URL} from "./movies.const";
import {extractMagnetFromQuery} from "./movies.util";



export const movieSearch = async (searchTerm: string) =>
{
	const searchResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`)
	const $ = cheerio.load(searchResult.data);

	const data = $("#index tr").toArray();
	return data
	.map((item) =>
	{
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
