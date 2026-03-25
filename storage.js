const KEYS = {
  favorites: 'reel_favorites',
  watchlist: 'reel_watchlist',
  ratings:   'reel_ratings',
};
function getList(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}
function getFavorites() {
  return getList(KEYS.favorites);
}
function addFavorite(movie) {
  const list = getFavorites();
  if (!list.find(m => m.id === movie.id)) {
    list.push(movie);
    saveList(KEYS.favorites, list);
  }
}
function removeFavorite(movieId) {
  const list = getFavorites().filter(m => m.id !== movieId);
  saveList(KEYS.favorites, list);
}
function isFavorite(movieId) {
  return getFavorites().some(m => m.id === movieId);
}
function toggleFavorite(movie) {
  if (isFavorite(movie.id)) {
    removeFavorite(movie.id);
    return false;
  } else {
    addFavorite(movie);
    return true; 
  }
}
function getWatchlist() {
  return getList(KEYS.watchlist);
}
function addToWatchlist(movie) {
  const list = getWatchlist();
  if (!list.find(m => m.id === movie.id)) {
    list.push(movie);
    saveList(KEYS.watchlist, list);
  }
}
function removeFromWatchlist(movieId) {
  const list = getWatchlist().filter(m => m.id !== movieId);
  saveList(KEYS.watchlist, list);
}
function isInWatchlist(movieId) {
  return getWatchlist().some(m => m.id === movieId);
}
function toggleWatchlist(movie) {
  if (isInWatchlist(movie.id)) {
    removeFromWatchlist(movie.id);
    return false; 
  } else {
    addToWatchlist(movie);
    return true;
  }
}
function getRatings() {
  return JSON.parse(localStorage.getItem(KEYS.ratings) || '{}');
}
function rateMovie(movieId, stars) {
  const ratings = getRatings();
  ratings[movieId] = stars;
  localStorage.setItem(KEYS.ratings, JSON.stringify(ratings));
}
function getMovieRating(movieId) {
  return getRatings()[movieId] || 0;
}
function removeRating(movieId) {
  const ratings = getRatings();
  delete ratings[movieId];
  localStorage.setItem(KEYS.ratings, JSON.stringify(ratings));
}
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
