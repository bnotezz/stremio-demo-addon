import fs from 'fs/promises';
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'dotenv/config';

interface FilmInfo {
    title: string;
    year: string;
    description: string;
    poster: string;
    url: string;
    backdrop: string;
    logo: string;
    subtitle: string;
    youtube: string;
}

const BASE_URL = 'https://studio.blender.org';
const FILMS_URL = `${BASE_URL}/films/`;

// Standard browser headers to avoid being blocked by strict server policies
const client = axios.create({
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
    },
    timeout: 10000,
});

function toAbsoluteUrl(urlStr: string | undefined): string {
    if (!urlStr) return '';
    try {
        return new URL(urlStr, BASE_URL).href;
    } catch {
        return urlStr;
    }
}

function extractIdFromUrl(urlString: string) {
    try {
        const url = new URL(urlString);
        if (url.hostname === 'youtu.be') {
            return url.pathname.slice(1);
        }
        return url.searchParams.get('v') || url.pathname.split('/').pop();
    } catch (e) {
        return null;
    }
}

async function scrapeFilms(): Promise<void> {
    console.log(`[1/3] Connecting to ${FILMS_URL}...`);

    let response;
    try {
        response = await client.get<string>(FILMS_URL);
    } catch (err: any) {
        console.error(`❌ Failed to fetch main list! Status/Message:`, err.message);
        if (err.response) {
            console.error(`Server returned status code: ${err.response.status}`);
        }
        return;
    }

    console.log(`[2/3] HTML received. Parsing cards...`);
    const $ = cheerio.load(response.data);
    const filmCards = $('.cards-item-film').toArray();

    if (filmCards.length === 0) {
        console.warn(`⚠️ No cards matching '.cards-item-film' found. Checking for alternative selectors...`);
        // Fallback query if class names changed slightly
        const altCards = $('.cards-item').toArray();
        console.log(`Found ${altCards.length} alternative card items.`);
    } else {
        console.log(`Found ${filmCards.length} film cards. Scraping details...\n`);
    }

    const filmsData: FilmInfo[] = [];

    for (const [index, card] of filmCards.entries()) {
        const $card = $(card);
        const $link = $card.find('a.cards-item-content');

        if (!$link.length) continue;

        const relativeUrl = $link.attr('href')?.trim();
        const filmUrl = toAbsoluteUrl(relativeUrl);

        const title = $card.find('.cards-item-title span.me-2').text().trim() || $card.find('.cards-item-title').text().trim();
        const year = $card.find('.cards-item-title span.badge').text().trim();
        const description = $card.find('.cards-item-excerpt p').text().trim();
        const rawPoster = $card.find('.cards-item-thumbnail img').attr('src')?.trim();

        if (!year || year === 'In Development') continue;

        console.log(`[${index + 1}/${filmCards.length}] Fetching: ${title || 'Unknown Title'} (${year})`);

        const filmInfo: FilmInfo = {
            title,
            year,
            description,
            poster: toAbsoluteUrl(rawPoster),
            url: filmUrl,
            backdrop: '',
            logo: '',
            subtitle: '',
            youtube: '',
        };

        try {
            const detailRes = await client.get<string>(filmUrl);
            const $detail = cheerio.load(detailRes.data);

            const rawBackdrop =
                $detail('meta[property="og:image"]').attr('content') ||
                $detail('meta[name="og:image"]').attr('content') ||
                '';
            filmInfo.backdrop = toAbsoluteUrl(rawBackdrop.trim());

            const rawLogo = $detail('img.film-logo').attr('src') || '';
            filmInfo.logo = toAbsoluteUrl(rawLogo.trim());

            filmInfo.subtitle = $detail('p.hero-subtitle').text().trim();

            let youtube =
                $detail('button[data-video], a[data-video]').attr('data-video') || '';

            if (!youtube) {
                youtube =
                    $detail('a[href*="youtube.com"], a[href*="youtu.be"]').attr('href') ||
                    '';
            }

            if (youtube) {
                const videoId = extractIdFromUrl(youtube);
                if (videoId) {
                    filmInfo.youtube = videoId;
                }
            }


        } catch (err: any) {
            console.error(`   ⚠️ Failed fetching detail page for ${title}:`, err.message);
        }

        filmsData.push(filmInfo);
    }

    console.log(`\n[3/3] Writing results to file...`);
    const outputFile = '../data/blender_films.json';
    await fs.writeFile(outputFile, JSON.stringify(filmsData, null, 2), 'utf-8');
    console.log(`✅ Finished! Saved ${filmsData.length} films to '${outputFile}'.`);
}

// Immediate execution trigger with top-level error trapping
(async () => {
    try {
        await scrapeFilms();
    } catch (err) {
        console.error('Fatal execution error:', err);
        process.exit(1);
    }
})();