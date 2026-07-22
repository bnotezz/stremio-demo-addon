//scrape mdblist.com for movie details
import fs from "fs";
import 'dotenv/config';

const API_URL = "https://api.mdblist.com";
const API_KEY = process.env.MDBLIST_API_KEY;

async function getBlenderMovies() {
    // read file ../data/blender.movies.tmdb.json
    console.log("Reading blender.movies.tmdb.json...");
    const movies = JSON.parse(fs.readFileSync("../data/blender.movies.tmdb.json", "utf8"));
    console.log(`Found ${movies.length} movies.`);

    //extract ids   
    const ids = movies.map((movie: any) => movie.id);
    console.log(`Extracted ${ids.length} ids.`);
    return ids;
}

async function fetchMovies(ids: number[]) {
    //POST https://api.mdblist.com/tmdb/movie/
    //ids": [
    //     10378,
    //     133701,
    //     1062079,1177628
    //   ]

    const response = await fetch(`${API_URL}/tmdb/movie/?apikey=${API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ids: ids,
        }),
    });
    const data = await response.json();

    return data;
}

function saveJsonToFile(data: any, fileName: string) {
    fs.writeFileSync(`../data/${fileName}.json`, JSON.stringify(data, null, 2));
}

async function main() {
    const ids = await getBlenderMovies();
    const movies = await fetchMovies(ids);
    console.log("Movies found", movies.length);
    saveJsonToFile(movies, "blender.movies.mdblist");
    console.log("Done!");
}

main();


