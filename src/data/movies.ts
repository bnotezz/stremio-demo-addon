import { StremioMovie } from '../types';

export const OPEN_MOVIES: StremioMovie[] = [
  {
    id: "tt1254207",
    tmdbId: "10378",
    type: "movie",
    name: "Big Buck Bunny",
    poster: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg",
    background: "https://peach.blender.org/wp-content/uploads/title_sq.jpg",
    logo: "https://peach.blender.org/wp-content/uploads/bbb-logo.png",
    description: "Великий і добродушний кролик проти трьох злісних лісових шкідників (бурундуків), які заважають йому насолоджуватися життям. Класичний відкритий 3D-мультфільм Blender Institute.",
    year: 2008,
    genres: ["Animation", "Comedy", "Short"],
    director: "Sacha Goedegebure",
    cast: ["Big Buck Bunny", "Rinky", "Gimera", "Frank"],
    rating: "8.1",
    duration: "10m",
    streams: [
      { title: "Mux Adaptive HLS (1080p)", url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", format: "hls", quality: "1080p" },
      { title: "Direct Google Storage MP4 (720p)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", format: "mp4", quality: "720p" }
    ]
  },
  {
    id: "tt1727587",
    tmdbId: "45745",
    type: "movie",
    name: "Sintel",
    poster: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg",
    background: "https://durian.blender.org/wp-content/uploads/2010/10/sintel_wallpaper_02.png",
    logo: "https://durian.blender.org/wp-content/uploads/2010/05/logo_sintel_small.png",
    description: "Дівчина-воїн Sintel вирушає у небезпечну подорож, щоб знайти та врятувати маленького дракона на ім'я Скейлз, якого викрав дорослий дракон.",
    year: 2010,
    genres: ["Animation", "Fantasy", "Adventure", "Short"],
    director: "Colin Levy",
    cast: ["Halina Reijn", "Thom Hoffman"],
    rating: "7.5",
    duration: "15m",
    streams: [
      { title: "Akamai Adaptive HLS (1080p)", url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8", format: "hls", quality: "1080p" },
      { title: "Direct Google MP4 (720p)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", format: "mp4", quality: "720p" }
    ]
  },
  {
    id: "tt2387433",
    tmdbId: "124595",
    type: "movie",
    name: "Tears of Steel",
    poster: "https://upload.wikimedia.org/wikipedia/commons/0/08/Tears_of_Steel_poster.jpg",
    background: "https://mango.blender.org/wp-content/uploads/2012/09/tos_wallpaper_01.jpg",
    description: "Науково-фантастичний трилер, дія якого відбувається в Амстердамі майбутнього, де група бійців використовує високі технології для порятунку світу від роботів.",
    year: 2012,
    genres: ["Sci-Fi", "Action", "Short"],
    director: "Ian Hubert",
    cast: ["Derek de Lint", "Sergio Hasselbaink", "Rogier Schippers"],
    rating: "7.0",
    duration: "12m",
    streams: [
      { title: "Unified HLS Stream (1080p)", url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", format: "hls", quality: "1080p" },
      { title: "Direct Google MP4 (1080p)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", format: "mp4", quality: "1080p" }
    ]
  },
  {
    id: "tt4897284",
    tmdbId: "352726",
    type: "movie",
    name: "Cosmos Laundromat",
    poster: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Cosmos_Laundromat_-_First_Cycle_-_Poster.jpg",
    background: "https://images.squarespace-cdn.com/content/v1/5681023a841aba68339c0175/1454199923891-B7301R2A4AOT6H08F1N5/laundromat.jpg",
    description: "На безлюдному острові вівця Франк намагається накласти на себе руки, але його рятує загадковий власник пральні Віктор, який пропонує йому подорожувати світами.",
    year: 2015,
    genres: ["Animation", "Comedy", "Sci-Fi", "Short"],
    director: "Mathieu Auvray",
    cast: ["Pierre Bokma", "Reinout Scholten van Aschat"],
    rating: "8.2",
    duration: "12m",
    streams: [
      { title: "Blender Official HLS 1080p", url: "https://video.blender.org/static/streaming-playlists/hls/92c61e47-e170-4286-9a2c-474965df4b6b/master.m3u8", format: "hls", quality: "1080p" }
    ]
  },
  {
    id: "tt10156948",
    tmdbId: "590216",
    type: "movie",
    name: "Spring",
    poster: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Spring_-_Poster.jpg",
    background: "https://cloud.blender.org/static/images/spring/hero.jpg",
    description: "Поетична історія про молоду вівчарку та її собаку, які стикаються з древніми духами, щоб продовжити природний цикл зміни пір року.",
    year: 2019,
    genres: ["Animation", "Fantasy", "Family", "Short"],
    director: "Andy Goralczyk",
    rating: "8.0",
    duration: "8m",
    streams: [
      { title: "Blender Official HLS 1080p", url: "https://video.blender.org/static/streaming-playlists/hls/048866e4-4d87-4ee2-b1d7-e855c82ffc41/master.m3u8", format: "hls", quality: "1080p" }
    ]
  },
  {
    id: "tt6916538",
    tmdbId: "458156",
    type: "movie",
    name: "Agent 327: Operation Barbershop",
    poster: "https://images.squarespace-cdn.com/content/v1/5681023a841aba68339c0175/1495475143324-WUPY9J7H0B3K3Q8D8X4O/agent327_poster.jpg",
    background: "https://studio.blender.org/static/films/agent-327/hero.jpg",
    description: "Секретний агент 327 досліджує перукарню в Роттердамі, де стикається зі своїм запеклим ворогом Ву Сільським.",
    year: 2017,
    genres: ["Animation", "Action", "Comedy", "Short"],
    director: "Hjalti Hjalmarsson, Colin Levy",
    rating: "7.8",
    duration: "4m",
    streams: [
      { title: "Blender Official HLS 1080p", url: "https://video.blender.org/static/streaming-playlists/hls/de6e2f69-70dc-41f2-ba2e-2f95470d0615/master.m3u8", format: "hls", quality: "1080p" }
    ]
  },
  {
    id: "open-nasa-iss",
    type: "movie",
    name: "NASA Ultra HD Earth Views from ISS",
    poster: "https://www.nasa.gov/wp-content/uploads/2023/03/earth_from_iss.jpg",
    background: "https://www.nasa.gov/wp-content/uploads/2023/03/earth_from_iss.jpg",
    description: "Дивовижні види планети Земля з Міжнародної Космічної Станції у форматі Ultra HD. Стрім надає унікальну можливість спостерігати за нашою планетою в реальному часі.",
    year: 2024,
    genres: ["Space & Science", "Nature"],
    director: "NASA Crew",
    rating: "9.2",
    duration: "Live",
    streams: [
      { title: "NASA Public HLS Live", url: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8", format: "hls", quality: "1080p" }
    ]
  },
  {
    id: "open-apple-hls",
    type: "movie",
    name: "Apple HLS Advanced Test Suite",
    poster: "https://developer.apple.com/news/images/og/http-live-streaming-og.png",
    background: "https://developer.apple.com/news/images/og/http-live-streaming-og.png",
    description: "Офіційний тестовий потік Apple для демонстрації можливостей HLS (адаптивний бітрейт, підтримка fMP4, субтитрів та багатканального аудіо).",
    year: 2025,
    genres: ["HLS Test Bench"],
    rating: "9.0",
    duration: "10m",
    streams: [
      { title: "Apple Official Master Playlist", url: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8", format: "hls", quality: "1080p" }
    ]
  }
];