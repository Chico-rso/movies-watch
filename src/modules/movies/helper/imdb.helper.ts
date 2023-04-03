import {IMDBMovie, Movie} from "../movies.interfaces";

export const getMovieCredits = () =>
{

}

// {
//   "adult": false,
//   "backdrop_path": "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
//   "belongs_to_collection": {
//     "id": 531241,
//     "name": "Spider-Man (Avengers) Collection",
//     "poster_path": "/nogV4th2P5QWYvQIMiWHj4CFLU9.jpg",
//     "backdrop_path": "/AvnqpRwlEaYNVL6wzC4RN94EdSd.jpg"
//   },
//   "budget": 200000000,
//   "genres": [
//     {
//       "id": 28,
//       "name": "Action"
//     },
//     {
//       "id": 12,
//       "name": "Adventure"
//     },
//     {
//       "id": 878,
//       "name": "Science Fiction"
//     }
//   ],
//   "homepage": "https://www.spidermannowayhome.movie",
//   "id": 634649,
//   "imdb_id": "tt10872600",
//   "original_language": "en",
//   "original_title": "Spider-Man: No Way Home",
//   "overview": "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
//   "popularity": 430.222,
//   "poster_path": "/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg",
//   "production_companies": [
//     {
//       "id": 420,
//       "logo_path": "/hUzeosd33nzE5MCNsZxCGEKTXaQ.png",
//       "name": "Marvel Studios",
//       "origin_country": "US"
//     },
//     {
//       "id": 84041,
//       "logo_path": "/nw4kyc29QRpNtFbdsBHkRSFavvt.png",
//       "name": "Pascal Pictures",
//       "origin_country": "US"
//     },
//     {
//       "id": 5,
//       "logo_path": "/lieeAioEBVsgsoDT9HICrdt5iRa.png",
//       "name": "Columbia Pictures",
//       "origin_country": "US"
//     }
//   ],
//   "production_countries": [
//     {
//       "iso_3166_1": "US",
//       "name": "United States of America"
//     }
//   ],
//   "release_date": "2021-12-15",
//   "revenue": 1921847111,
//   "runtime": 148,
//   "spoken_languages": [
//     {
//       "english_name": "English",
//       "iso_639_1": "en",
//       "name": "English"
//     },
//     {
//       "english_name": "Tagalog",
//       "iso_639_1": "tl",
//       "name": ""
//     }
//   ],
//   "status": "Released",
//   "tagline": "The Multiverse unleashed.",
//   "title": "Spider-Man: No Way Home",
//   "video": false,
//   "vote_average": 8.012,
//   "vote_count": 17086
// }

export const covertMovie = ({
		title,
		original_title,
		overview,
		release_date
	}: IMDBMovie): Movie => {
	return ({
		title,
		plot: overview,
		year: new Date(release_date).getFullYear().toString(),
		director: 'Джон Уоттс',
		actors: [
			'Том Холланд',
			'Зендея',
			'Бенедикт Камбербэтч',
			'Мариса Томей',
			'Уиллем Дефо',
			'Альфред Молина',
			'Джейми Фокс',
			'Томас Хейден Чёрч',
			'Рис Иванс',
			'Джейкоб Баталон'
		],
		poster: 'https://s.rutor.org/imgproxy.php?url=http://lostpix.com/thumbs/2022-10/20/nzvcef43fj0iz2sx81mioj2xy.png',
		trailer: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
		boxOffice: '',
		released: '2021',
		writer: 'Крис МакКенна',
		runtime: '148',
		ratingImdb: '8.3',
		imdbId: 'tt10872600',
		rated: 'PG-13 ',
		genres: ['Фантастика', 'боевик', 'приключения', 'фэнтези'],
		fileName: 'ChelovekPaukNetPutiDomojWEBDLRip1080p.mkv',
		magnet: 'e06f9f7513321454b8d023e879a9980441dcd385',
		sourceUrl: 'https://rutor.org/torrent/893033'
	})
}
