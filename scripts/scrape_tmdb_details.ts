// STEP 1
// download blender movies from tmdb
// and save to blender.movies.tmdb.json
// STEP 2
// fetch each movie details and save to tmdb/<id>.json
import 'dotenv/config';
const API_KEY = process.env.TMDB_API_KEY;
const BLENDER_COMPANY_ID = "6908";

const fs = require("fs");

const BASE_URL = "https://api.themoviedb.org/3";


async function fetchMovies() {
    const response = await fetch(`${BASE_URL}/discover/movie?language=en&api_key=${API_KEY}&sort_by=popularity.desc&with_companies=${BLENDER_COMPANY_ID}`);
    const data = await response.json();
    return data.results;
}

async function fetchMovie(id: number) {
    const response = await fetch(`${BASE_URL}/movie/${id}?language=en&api_key=${API_KEY}&append_to_response=images,credits,videos,external_ids`);
    const data = await response.json();
    return data;
}

function getMovieGenres(movie: any) {
    return movie.genre_ids.map((id: number) => {
        return GENRES[id];
    });
}

const GENRES: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

function saveJsonToFile(data: any, fileName: string) {
    fs.writeFileSync(`../data/${fileName}.json`, JSON.stringify(data, null, 2));
}

async function main() {
    console.log("Starting to fetch movies...");
    const movies = await fetchMovies();
    console.log(`Found ${movies.length} movies.`);

    if (!fs.existsSync("../data")) {
        console.log("Creating data directory...");
        fs.mkdirSync("../data");
    }

    if (!fs.existsSync("../data/tmdb")) {
        console.log("Creating tmdb directory...");
        fs.mkdirSync("../data/tmdb");
    }

    const moviesWithGenres = movies.map((movie: any) => {
        return {
            ...movie,
            genres: getMovieGenres(movie),
        };
    });

    for (const movie of movies) {
        console.log(`Fetching movie ${movie.title}...`);
        const response = await fetchMovie(movie.id);
        saveJsonToFile(response, `tmdb/${movie.id}`);
    }

    saveJsonToFile(moviesWithGenres, "blender.movies.tmdb");
    console.log("Done!");
}

main();