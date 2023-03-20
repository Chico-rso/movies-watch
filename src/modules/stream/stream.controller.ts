import { Router } from "express";
import WebTorrent from "webtorrent";

const router = Router();
const client = new WebTorrent();

let state =
{
    progress: 0,
    downloadSpeed: 0,
    ratio: 0,
}

let error;

client.on('error', (err) =>{ error = err.message; console.log('error', err.message)});

client.on('torrent', (torrent) =>{
    state =
    {
        progress: Math.round(torrent.progress * 100 * 100) / 100, // Round to 2 decimal places
        downloadSpeed: torrent.downloadSpeed,
        ratio: torrent.ratio,
    }
});

router.get('/add/:magnet', (req, res) =>
{
    const magnet = req.params.magnet;

    client.add(magnet, (torrent) =>
    {
        const files = torrent.files.map((file) => ({
            name: file.name,
            length: file.length,
            path: file.path,
        }));
        res.status(200).send(files); // Send the file list
    });
});
router.get('/stats', (req, res) =>
{
    state =
    {
        progress: Math.round(client.progress * 100 * 100) / 100, // Round to 2 decimal places
        downloadSpeed: client.downloadSpeed,
        ratio: client.ratio,
    }
    res.status(200).send(state);
});

export default router

