function renderWatchlistPage() {
  const grid  = document.getElementById('watchlist-grid');
  const count = document.getElementById('watch-count');
  const list  = getWatchlist();
  if (!list.length) {
    count.textContent = '0 movies saved';
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">📋</div>
        <p>Your watchlist is empty. Add movies you want to watch later.</p>
        <a href="index.html">← Browse Movies</a>
      </div>`;
    return;
  }
  count.textContent = `${list.length} movie${list.length !== 1 ? 's' : ''} to watch`;
  grid.innerHTML = '';

  list.forEach(movie => {
    const watched = getMovieRating(movie.id) > 0; // treat rated = watched

    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <div style="position:relative;">
        <img
          class="movie-card-img"
          src="${getPosterURL(movie.poster_path)}"
          alt="${movie.title}"
          loading="lazy"
          style="${watched ? 'opacity:0.5;' : ''}"
        />
        ${watched ? `<div style="
          position:absolute;inset:0;display:flex;align-items:center;
          justify-content:center;font-size:28px;border-radius:var(--radius-md);">
          ✓</div>` : ''}
        <button
          class="remove-btn"
          title="Remove from watchlist"
          onclick="removeWatchAndRefresh(${movie.id}, event)"
        >✕</button>
      </div>
      <p class="movie-card-title">${movie.title}</p>
      <p class="movie-card-score" style="color:${watched ? 'var(--red)' : 'var(--txt3)'};font-size:11px;">
        ${watched ? '✓ Watched' : 'Not watched yet'}
      </p>
    `;
    card.addEventListener('click', () => openModal(movie.id));
    grid.appendChild(card);
  });
}
function removeWatchAndRefresh(movieId, e) {
  e.stopPropagation();
  removeFromWatchlist(movieId);
  renderWatchlistPage();
  showToast('Removed from watchlist');
}
document.addEventListener('DOMContentLoaded', () => {
  renderWatchlistPage();
  const navSearch = document.getElementById('nav-search');
  if (navSearch) {
    navSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && navSearch.value.trim()) {
        window.location.href = `search.html?q=${encodeURIComponent(navSearch.value.trim())}`;
      }
    });
  }
});
const _origCloseW = window.closeModal;
window.closeModal = function () {
  _origCloseW && _origCloseW();
  renderWatchlistPage();
};
