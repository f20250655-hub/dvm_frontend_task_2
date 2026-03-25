async function openModal(movieId) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-loading">
      <div class="spinner"></div>
    </div>
  `;
  try {
    const [movie, credits] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId)
    ]);
    renderModal(movie, credits);
  } catch (err) {
    document.getElementById('modal-content').innerHTML = `
      <p style="color:var(--txt3); padding: 40px; text-align:center;">
        Failed to load movie details.
      </p>
    `;
  }
}
function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
function renderModal(movie, credits) {
  const isFav      = isFavorite(movie.id);
  const inWatch    = isInWatchlist(movie.id);
  const userRating = getMovieRating(movie.id);
  const cast = (credits.cast || []).slice(0, 8);
  const genres = (movie.genres || []).map(g => g.name);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-box">
      <button class="modal-close" onclick="closeModal()">✕</button>
      <!-- header -->
      <div class="modal-header">
        <img
          class="modal-poster"
          src="${getPosterURL(movie.poster_path)}"
          alt="${movie.title}"
        />
        <div class="modal-info">
          <span class="hero-badge">
            ${movie.vote_average >= 8 ? 'Top Rated' : 'In Theatres'}
          </span>
          <h2 class="modal-title">${movie.title}</h2>
          <p class="modal-meta">
            ${year}
            ${runtime ? '· ' + runtime : ''}
            · ${movie.original_language.toUpperCase()}
          </p>
          <p class="modal-rating">★ ${rating} / 10
            <span class="modal-votes">(${(movie.vote_count || 0).toLocaleString()} votes)</span>
          </p>
          <div class="hero-tags">
            ${genres.map(g => `<span class="tag">${g}</span>`).join('')}
          </div>
        </div>
      </div>
      <!-- overview -->
      <div class="modal-body">
        <p class="modal-section-label">Overview</p>
        <p class="modal-overview">${movie.overview || 'No overview available.'}</p>
        <!-- cast -->
        ${cast.length ? `
          <p class="modal-section-label">Cast</p>
          <div class="modal-cast">
            ${cast.map(c => `
              <div class="cast-item">
                <img
                  class="cast-avatar"
                  src="${getPosterURL(c.profile_path)}"
                  alt="${c.name}"
                  onerror="this.src='https://via.placeholder.com/60x60/1f0a0a/e53935?text=${c.name[0]}'"
                />
                <span class="cast-name">${c.name}</span>
                <span class="cast-char">${c.character || ''}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <!-- star rating -->
        <p class="modal-section-label">Your Rating</p>
        <div class="star-rating" data-movie-id="${movie.id}">
          ${[1,2,3,4,5].map(n => `
            <span
              class="star ${n <= userRating ? 'filled' : ''}"
              data-value="${n}"
              onclick="handleRate(${movie.id}, ${n})"
            >★</span>
          `).join('')}
          ${userRating
            ? `<span class="star-label">${userRating}/5</span>`
            : `<span class="star-label">Not rated</span>`
          }
        </div>
        <!-- actions -->
        <div class="modal-actions">
          <button
            id="btn-fav-${movie.id}"
            class="btn ${isFav ? 'btn-primary' : 'btn-ghost'}"
            onclick="handleFavorite(${movie.id})"
          >
            ${isFav ? '♥ Favorited' : '♡ Favorite'}
          </button>
          <button
            id="btn-watch-${movie.id}"
            class="btn ${inWatch ? 'btn-primary' : 'btn-ghost'}"
            onclick="handleWatchlist(${movie.id})"
          >
            ${inWatch ? '✓ In Watchlist' : '+ Watchlist'}
          </button>
        </div>
      </div>

    </div>
  `;
}
function handleFavorite(movieId) {
  const title  = document.querySelector('.modal-title')?.textContent || '';
  const poster = document.querySelector('.modal-poster')?.src || '';
  const rating = document.querySelector('.modal-rating')?.textContent.trim() || '';
  const movie = { id: movieId, title, poster_path: null, _posterFull: poster, vote_average: parseFloat(rating) || 0 };
  const added = toggleFavorite(movie);
  const btn = document.getElementById(`btn-fav-${movieId}`);
  if (btn) {
    btn.className = `btn ${added ? 'btn-primary' : 'btn-ghost'}`;
    btn.textContent = added ? '♥ Favorited' : '♡ Favorite';
  }
}
function handleWatchlist(movieId) {
  const title  = document.querySelector('.modal-title')?.textContent || '';
  const poster = document.querySelector('.modal-poster')?.src || '';
  const movie = { id: movieId, title, poster_path: null, _posterFull: poster };
  const added = toggleWatchlist(movie);
  const btn = document.getElementById(`btn-watch-${movieId}`);
  if (btn) {
    btn.className = `btn ${added ? 'btn-primary' : 'btn-ghost'}`;
    btn.textContent = added ? '✓ In Watchlist' : '+ Watchlist';
  }
}
function handleRate(movieId, stars) {
  const existing = getMovieRating(movieId);
  if (existing === stars) {
    removeRating(movieId);
    updateStarUI(movieId, 0);
  } else {
    rateMovie(movieId, stars);
    updateStarUI(movieId, stars);
  }
}
function updateStarUI(movieId, rating) {
  const container = document.querySelector(`.star-rating[data-movie-id="${movieId}"]`);
  if (!container) return;
  container.querySelectorAll('.star').forEach(star => {
    const val = parseInt(star.dataset.value);
    star.classList.toggle('filled', val <= rating);
  });
  const label = container.querySelector('.star-label');
  if (label) label.textContent = rating ? `${rating}/5` : 'Not rated';
}