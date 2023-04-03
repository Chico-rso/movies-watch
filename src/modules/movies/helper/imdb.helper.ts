import {GetCreditsResponse, IMDBMovie, Movie, SearchMoviesResponse} from "../movies.interfaces";
import {stringify} from "qs";
import axios from "axios";
import {IMDB_SEARCH_URL} from "../movies.const";
import * as process from "process";


export const IMDBRequests = () => {
	const queryParams = stringify({
		lang: "ru-RU",
		api_key: process.env.IMDB_API_KEY,
	})

	const MOVIE_URL = `${IMDB_SEARCH_URL}/movie`
	return {
		getMovie: (IMDBId: string) => axios.get<IMDBMovie>(`${MOVIE_URL}/${IMDBId}?${queryParams}`),
		getMovieCredits: (IMDBId: number) => axios.get<GetCreditsResponse>(`${MOVIE_URL}/${IMDBId}/credits?${queryParams}`),
		searchMovie: (query: string) => axios.get<SearchMoviesResponse>(`${MOVIE_URL}/search/movie?${queryParams}&query=${query}`),
		getVideos: (IMDBId: number) => axios.get(`${MOVIE_URL}/${IMDBId}/videos?${queryParams}`)
	}
}
export const getMovieCredits = async (IMDBId: number) => {
	try
	{
		const {getMovieCredits} = IMDBRequests();
		const {data: {crew, cast}} = await getMovieCredits(IMDBId);
		const actors = cast.map(({name}) => name);
		const {name = ""} = crew.find(({job}) => job === "Director");

		return {
			actors,
			director: name
		}
	}
	catch(error)
	{
		console.log(error);
		return {
			actors: [],
			director: ""
		};
	}
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

export const covertMovie = async ({
		title,
		original_title,
		overview,
		release_date,
		id,
	}: IMDBMovie): Promise<Partial<Movie>> => {
	const { actors, director } = await getMovieCredits(id);
	return {
		title,
		plot: overview,
		year: new Date(release_date).getFullYear().toString(),
		director,
		actors,
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
	}
}
