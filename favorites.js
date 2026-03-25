function renderFavoritesPage() {
  const grid  = document.getElementById('favorites-grid');
  const count = document.getElementById('fav-count');
  const favs  = getFavorites();
  if (!favs.length) {
    count.textContent = '0 movies saved';
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">♡</div>
        <p>No favorites yet. Browse movies and hit ♡ Favorite to save them here.</p>
        <a href="index.html">← Browse Movies</a>
      </div>`;
    return;
  }
  count.textContent = `${favs.length} movie${favs.length !== 1 ? 's' : ''} saved`;
  grid.innerHTML = '';
  favs.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `<div style="position:relative;">
        <img
          class="movie-card-img"
          src="${getPosterURL(movie.poster_path)}"
          alt="${movie.title}"
          loading="lazy"
        />
        <button
          class="remove-btn"
          title="Remove from favorites"
          onclick="removeFavAndRefresh(${movie.id}, event)"
        >✕</button>
      </div>
      <p class="movie-card-title">${movie.title}</p>
      <p class="movie-card-score" style="color:var(--txt3);font-size:11px;">
        ${getMovieRating(movie.id) ? '★'.repeat(getMovieRating(movie.id)) + ' rated' : 'Not rated'}
      </p>
    `;
    card.addEventListener('click', () => openModal(movie.id));
    grid.appendChild(card);
  });
}
function removeFavAndRefresh(movieId, e) {
  e.stopPropagation();
  removeFavorite(movieId);
  renderFavoritesPage();
  showToast('Removed from favorites');
}
document.addEventListener('DOMContentLoaded', () => {
  renderFavoritesPage();
  const navSearch = document.getElementById('nav-search');
  if (navSearch) {
    navSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && navSearch.value.trim()) {
        window.location.href = `search.html?q=${encodeURIComponent(navSearch.value.trim())}`;
      }
    });
  }
});
const _origClose = window.closeModal;
window.closeModal = function () {
  _origClose && _origClose();
  renderFavoritesPage();
};
