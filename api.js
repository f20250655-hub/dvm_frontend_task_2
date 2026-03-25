const API_KEY = "529e6b9106aa248f81a5734495dcde25";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
async function fetchTMDB(endpoint) {
  const url = `${BASE_URL}${endpoint}&api_key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error: " + res.status);
  return res.json();
}
async function getNowPlaying() {
  return fetchTMDB("/movie/now_playing?language=en-US&page=1");
}
async function getPopular() {
  return fetchTMDB("/movie/popular?language=en-US&page=1");
}
async function getTopRated() {
  return fetchTMDB("/movie/top_rated?language=en-US&page=1");
}
async function getTrending() {
  return fetchTMDB("/trending/movie/week?language=en-US");
}
async function getMovieDetails(movieId) {
  return fetchTMDB(`/movie/${movieId}?language=en-US`);
}
async function getMovieCredits(movieId) {
  return fetchTMDB(`/movie/${movieId}/credits?language=en-US`);
}
async function searchMovies(query, page = 1) {
  return fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`);
}
function getPosterURL(path) {
  if (!path) return "https://via.placeholder.com/200x300/1f0a0a/e53935?text=No+Image";
  return IMG_BASE + path;
}
function getBackdropURL(path) {
  if (!path) return "";
  return IMG_ORIGINAL + path;
}
function getGenreNames(genres) {
  return (genres || []).map(g => g.name);
}