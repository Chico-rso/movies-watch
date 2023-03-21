import { Router, Response, Request, NextFunction } from "express";
import WebTorrent, {Torrent, TorrentFile} from "webtorrent";

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
        downloadSpeed: torrent.downloadSpeed, // Bytes per second
        ratio: torrent.ratio, // Upload / Download
    }
});

router.get('/add/:magnet', (req: Request, res: Response) =>
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
router.get('/stats', (req: Request, res: Response) =>
{
    state =
    {
        progress: Math.round(client.progress * 100 * 100) / 100, // Round to 2 decimal places
        downloadSpeed: client.downloadSpeed,
        ratio: client.ratio,
    }
    res.status(200).send(state);
});

// stream file
interface StreamRequest extends Request
{
    params:
    {
        magnet: string,
        fileName: string,
    }
    headers:
    {
        range: string,
    }
}

interface ErrorWhithStatus extends Error
{
    status: number,
}
let stream = router.get('/stream/:magnet/:fileName', (req: StreamRequest, res: Response, next: NextFunction) =>
{
    const
    {
        params: { magnet, fileName},
        headers: { range },
    } = req;

    if(!range)
    {
        const error = new Error('Range header is required') as ErrorWhithStatus;
        error.status = 416;
        return next(error);

    }

    const torrentFile = client.get(magnet) as Torrent;

    let file: TorrentFile = <TorrentFile>{};
    file = <TorrentFile>{};

    for(let i = 0; i < torrentFile.files.length; i++)
    {
        const currentTorrentPiece = torrentFile.files[i];
        if(currentTorrentPiece.name === fileName)
        {
            file = currentTorrentPiece;
            break;
        }
    }

    const fileSize = file.length;
    const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-');

    const start = parseInt(startParsed);
    const end = endParsed ? parseInt(endParsed) : fileSize - 1;

    const chunkSize = (end - start) + 1;

    const headers =
    {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
    }
    res.writeHead(206, headers);

    const streamPositions = { start, end };

    const stream = file.createReadStream(streamPositions);

    stream.pipe(res);
    stream.on('error', (err) => next(err));
});

export default router


// import express, {Router, Request, Response, NextFunction} from "express";
// import WebTorrent, {Torrent, TorrentFile} from "webtorrent";
//
// const client = new WebTorrent();
// const router = Router();
//
// const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
//     const status = err instanceof ErrorWithStatus ? err.status : 500;
//     const message = err.message || "Internal Server Error";
//     res.status(status).json({error: message});
// };
//
// class ErrorWithStatus extends Error {
//     public status: number;
//
//     constructor(status: number, message: string) {
//         super(message);
//         this.status = status;
//     }
// }
//
// const addTorrent = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const magnet = req.params.magnet;
//         const torrent = await new Promise<Torrent>((resolve, reject) => {
//             client.add(magnet, (torrent) => resolve(torrent));
//         });
//
//         const files = torrent.files.map(({name, length, path}) => ({name, length, path}));
//         res.status(200).json({files});
//     } catch (err) {
//         next(new ErrorWithStatus(400, "Invalid magnet link"));
//     }
// };
//
// const getStats = async (req: Request, res: Response) => {
//     const progress = Math.round(client.progress * 100 * 100) / 100;
//     const downloadSpeed = client.downloadSpeed;
//     const ratio = client.ratio;
//     res.status(200).json({progress, downloadSpeed, ratio});
// };
//
// interface StreamRequest extends Request {
//     params: {
//         magnet: string;
//         fileName: string;
//     };
//     headers: {
//         range?: string;
//     };
// }
//
// const streamFile = async (req: StreamRequest, res: Response, next: NextFunction) => {
//     const {magnet, fileName} = req.params;
//     const range = req.headers.range || "";
//
//     if (!range) {
//         next(new ErrorWithStatus(416, "Range header is required"));
//         return;
//     }
//
//     try {
//         const torrentFile = client.get(magnet) as Torrent;
//         const file = torrentFile.files.find(({name}) => name === fileName);
//
//         if (!file) {
//             next(new ErrorWithStatus(404, "File not found in torrent"));
//             return;
//         }
//
//         const fileSize = file.length;
//         const [start, end] = range.replace(/bytes=/, "").split("-").map(Number);
//         const chunkSize = (end - start) + 1;
//
//         const stream = file.createReadStream({start, end});
//         res.status(206)
//             .set({
//                 "Content-Type": "video/mp4",
//                 "Content-Length": chunkSize,
//                 "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//                 "Accept-Ranges": "bytes",
//             });
//         stream.pipe(res);
//     } catch (err) {
//         next(new ErrorWithStatus(400, "Invalid magnet link or file name"));
//     }
// };
//
// router.get('/add/:magnet', addTorrent);
// router.get('/stats', getStats);
// router.get('/stream/:magnet/:fileName', streamFile);
//
// router.use(handleError);
//
// export default router;

