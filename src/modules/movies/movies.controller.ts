import { Router } from "express";
import axios from "axios";
import {SerachRequest} from "./movies.interfaces";
import * as cheerio from "cheerio";
import { parse } from "qs";


const router = Router();

const BASE_SEARCH_URL = "https://rutor.info/search/0/0/100/0";
const MAGNET_KEY = "magnet:?xt";
const SPLIT_MAGNET_STRING = "urn:btih:"

router.get('/search', async ({ query: { searchTerm } }, res) => {
    try
    {
        const searchResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`)
        const $ = cheerio.load(searchResult.data);

        const data = $("#index tr")
        const results = Array.from(data).map((item) =>
        {
            const [_, magnetTeg, title] = $(item).find("a").toArray();

            const magnetLink = $(magnetTeg).attr("href");
            const parsedMagnetLink = parse(magnetLink);

            const magnet = String(parsedMagnetLink[MAGNET_KEY]).slice(SPLIT_MAGNET_STRING.length + 1);

            return ({
                magnet,
                title: $(title).text()
            });
        });


        res.status(200).send(results);
    }
    catch (err)
    {
        res.status(400).send(err);
    }
});

export default router;
