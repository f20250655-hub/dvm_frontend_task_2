const genreMap = {
  28:'Action', 12:'Adventure', 16:'Animation', 35:'Comedy',
  80:'Crime', 18:'Drama', 14:'Fantasy', 27:'Horror',
  9648:'Mystery', 10749:'Romance', 878:'Sci-Fi', 53:'Thriller',
  10752:'War', 37:'Western', 99:'Documentary', 36:'History'
};
function createMovieCard(movie) {
  const div = document.createElement('div');
  div.className = 'movie-card';
  div.innerHTML = `
    <img
      class="movie-card-img"
      src="${getPosterURL(movie.poster_path)}"
      alt="${movie.title}"
      loading="lazy"
    />
    <div class="movie-card-title">${movie.title}</div>
    <div class="movie-card-score">★ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</div>
  `;
  div.addEventListener('click', () => openModal(movie.id));
  return div;
}
function renderRow(containerId, movies) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  movies.forEach(movie => container.appendChild(createMovieCard(movie)));
}
function renderHero(movie) {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const genres = (movie.genre_ids || []).slice(0, 3).map(id => genreMap[Number(id)]).filter(Boolean);
  const year   = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const favActive   = isFavorite(movie.id)    ? 'active' : '';
  const watchActive = isInWatchlist(movie.id) ? 'active' : '';
  hero.innerHTML = `
    <img class="hero-poster" src="${getPosterURL(movie.poster_path)}" alt="${movie.title}" />
    <div class="hero-info">
      <span class="hero-badge">Trending #1</span>
      <h2 class="hero-title">${movie.title}</h2>
      <p class="hero-meta">${year} &nbsp;·&nbsp; ★ ${rating} &nbsp;·&nbsp; ${movie.original_language.toUpperCase()}</p>
      <div class="hero-tags">
        ${genres.map(g => `<span class="tag">${g}</span>`).join('')}
      </div>
      <p class="hero-overview">${movie.overview ? movie.overview.slice(0, 180) + '...' : ''}</p>
      <div class="hero-actions">
        <button class="btn-primary" onclick="openModal(${movie.id})">View Details</button>
        <button id="hero-fav-btn" class="btn-ghost ${favActive}" onclick="handleHeroFav(${movie.id})">
          ${isFavorite(movie.id) ? '♥ Favorited' : '♡ Favorite'}
        </button>
        <button id="hero-watch-btn" class="btn-ghost ${watchActive}" onclick="handleHeroWatch(${movie.id})">
          ${isInWatchlist(movie.id) ? '✓ Watchlist' : '+ Watchlist'}
        </button>
      </div>
    </div>
  `;
}
let heroMovie = null;
function handleHeroFav(movieId) {
  if (!heroMovie) return;
  const added = toggleFavorite(heroMovie);
  const btn = document.getElementById('hero-fav-btn');
  btn.textContent = added ? '♥ Favorited' : '♡ Favorite';
  btn.classList.toggle('active', added);
}
function handleHeroWatch(movieId) {
  if (!heroMovie) return;
  const added = toggleWatchlist(heroMovie);
  const btn = document.getElementById('hero-watch-btn');
  btn.textContent = added ? '✓ Watchlist' : '+ Watchlist';
  btn.classList.toggle('active', added);
}
function showSkeletons(containerId, count = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = Array(count).fill(`
    <div class="movie-card">
      <div class="movie-card-img skeleton"></div>
      <div class="skeleton" style="height:12px;border-radius:4px;margin-bottom:4px;"></div>
      <div class="skeleton" style="height:10px;width:40%;border-radius:4px;"></div>
    </div>
  `).join('');
}
async function initHome() {
  showSkeletons('trending-row');
  showSkeletons('popular-row');
  showSkeletons('top-rated-row');
  showSkeletons('now-playing-row');
  try {
    const [trending, popular, topRated, nowPlaying] = await Promise.all([
      getTrending(), getPopular(), getTopRated(), getNowPlaying(),
    ]);
    heroMovie = trending.results[0];
    renderHero(heroMovie);
    renderRow('trending-row',    trending.results);
    renderRow('popular-row',     popular.results);
    renderRow('top-rated-row',   topRated.results);
    renderRow('now-playing-row', nowPlaying.results);
  } catch (err) {
    console.error('Failed to load homepage:', err);
    document.getElementById('hero').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠</div>
        <p>Could not load movies. Check your API key or internet connection.</p>
      </div>`;
  }
}
const navSearchInput = document.getElementById('nav-search-input');
if (navSearchInput) {
  navSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && navSearchInput.value.trim()) {
      window.location.href = `search.html?q=${encodeURIComponent(navSearchInput.value.trim())}`;
    }
  });
}
initHome();
