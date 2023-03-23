import { Router } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { parse } from "qs";

interface SearchResult {
	magnet: string;
	title: string;
	torrentUrl: string;
}

const router = Router();
const TORRENT_URL = "https://rutor.info";
const BASE_SEARCH_URL = "https://rutor.info/search/0/0/100/0";
const MAGNET_KEY = "magnet:?xt";
const SPLIT_MAGNET_STRING = "urn:btih:";

router.get('/search', async (req, res) => {
	const searchTerm = req.query.searchTerm as string;

	try {
		const searchResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`);
		const $ = cheerio.load(searchResult.data);

		const data = $("#index tr").toArray();
		const results: SearchResult[] = data.map((item) => {
			const [_, magnetTeg, title] = $(item).find("a").toArray();
			const magnetLink = $(magnetTeg).attr("href");
			const parsedMagnetLink = parse(magnetLink);
			const magnet = String(parsedMagnetLink[MAGNET_KEY]).replace(SPLIT_MAGNET_STRING,"");
			const torrentUrl = `${TORRENT_URL}${$(title).attr("href")}`;

			return {
				magnet,
				title: $(title).text(),
				torrentUrl
			};
		}).filter((item) => item.title);

		res.status(200).send(results);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

export default router;
