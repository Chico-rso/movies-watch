// import {Router, Response, Request, NextFunction} from 'express'
// import WebTorrent, {Torrent, TorrentFile} from 'webtorrent'
//
// const router = Router()
// const client = new WebTorrent()
//
// let state = {
//     progress: 0,
//     downloadSpeed: 0,
//     ratio: 0
// }
//
// let error
//
// client.on('error', (err: Error) => {
//     console.error('err', err.message)
//     error = err.message
// })
//
// client.on('torrent', () => {
//     console.log(client.progress)
//     state = {
//         progress: Math.round(client.progress * 100 * 100) / 100,
//         downloadSpeed: client.downloadSpeed,
//         ratio: client.ratio
//     }
// })
//
// router.get('/add/:magnet', (req: Request, res: Response) => {
//     const magnet = req.params.magnet
//
//     client.add(magnet, torrent => {
//         const files = torrent.files.map(data => ({
//             name: data.name,
//             length: data.length
//         }))
//
//         res.status(200).send(files)
//     })
// })
//
// router.get('/stats', (req: Request, res: Response) => {
//     state = {
//         progress: Math.round(client.progress * 100 * 100) / 100,
//         downloadSpeed: client.downloadSpeed,
//         ratio: client.ratio
//     }
//     res.status(200).send(state)
// })
//
// router.get('/:magnet/:fileName', (req: StreamRequest, res: Response, next: NextFunction) => {
//     const {
//         params: {magnet, fileName},
//         headers: {range}
//     } = req
//
//     if (!range) {
//         const err = new Error('Range is not defined, please make request from HTML5 Player') as ErrorWithStatus
//         err.status = 416
//         return next(err)
//     }
//
//     const torrentFile = client.get(magnet) as Torrent
//     let file = <TorrentFile>{}
//
//     for (let i = 0; i < torrentFile.files.length; i++) {
//         const currentTorrentPiece = torrentFile.files[i]
//         if (currentTorrentPiece.name === fileName) {
//             file = currentTorrentPiece
//         }
//     }
//     const fileSize = file.length
//     const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-')
//
//     const start = Number(startParsed)
//     const end = endParsed ? Number(endParsed) : fileSize - 1
//
//     const chunkSize = (end - start) + 1
//
//     const headers = {
//         'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//         'Accept-Ranges': 'bytes',
//         'Content-Length': chunkSize,
//         'Content-Type': 'video/mp4'
//     }
//
//     res.writeHead(206, headers)
//
//     const streamPositions = {
//         start,
//         end
//     }
//
//     const stream = file.createReadStream(streamPositions)
//
//     stream.pipe(res)
//
//     stream.on('error', err => {
//         return next(err)
//     })
// })
//
// export default router


import {Router, Request, Response, NextFunction} from 'express';
import WebTorrent, {Torrent, TorrentFile} from 'webtorrent';

interface StreamRequest extends Request {
    params: {
        magnet: string;
        fileName: string;
    };
    headers: {
        range: string;
    };
}

interface ErrorWithStatus extends Error {
    status: number;
}

const client = new WebTorrent();

const router = Router();

router.get('/add/:magnet', (req: Request, res: Response, next: NextFunction) => {
    const magnet = req.params.magnet;

    client.add(magnet, (torrent) => {
        const files = torrent.files.map((file) => ({
            name: file.name,
            length: file.length,
        }));

        res.status(200).send(files);
    }).on('error', (err: Error) => next(err));
});

router.get('/stats', (_: Request, res: Response) => {
    const {progress, downloadSpeed, ratio} = client;

    const state = {
        progress: Math.round(progress * 100 * 100) / 100,
        downloadSpeed,
        ratio,
    };

    res.status(200).send(state);
});

router.get('/:magnet/:fileName', (req: StreamRequest, res: Response, next: NextFunction) => {
    const {magnet, fileName} = req.params;
    const range = req.headers.range;

    if (!range) {
        const err = new Error('Range is not defined, please make request from HTML5 Player') as ErrorWithStatus;
        err.status = 416;
        return next(err);
    }

    const torrentFile = client.get(magnet) as Torrent;

    const file = torrentFile.files.find((file) => file.name === fileName);

    if (!file) {
        const err = new Error('File not found in torrent') as ErrorWithStatus;
        err.status = 404;
        return next(err);
    }

    const fileSize = file.length;
    const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-');
    const start = Number(startParsed);
    const end = endParsed ? Number(endParsed) : fileSize - 1;
    const chunkSize = (end - start) + 1;

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
    };

    res.writeHead(206, headers);

    const streamPositions = {
        start,
        end,
    };

    const stream = file.createReadStream(streamPositions);

    stream.pipe(res);

    stream.on('error', (err) => next(err));
});

client.on('error', (err: Error) => {
    console.error('Error: ', err.message);
});

export default router;

