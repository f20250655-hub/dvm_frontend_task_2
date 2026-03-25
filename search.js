let debounceTimer = null;
let currentQuery  = '';
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  if (!input) return;
  const params = new URLSearchParams(window.location.search);
  const urlQuery = params.get('q') || '';
  if (urlQuery) {
    input.value = urlQuery;
    runSearch(urlQuery);
  }
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = input.value.trim();
    if (!q) { showEmpty(); return; }
    debounceTimer = setTimeout(() => runSearch(q), 380);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(debounceTimer);
      const q = input.value.trim();
      if (q) runSearch(q);
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const navSearch = document.getElementById('nav-search');
  if (!navSearch) return;
  navSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && navSearch.value.trim()) {
      window.location.href = `search.html?q=${encodeURIComponent(navSearch.value.trim())}`;
    }
  });
});
async function runSearch(query) {
  if (query === currentQuery) return;
  currentQuery = query;
  const grid  = document.getElementById('search-results');
  const count = document.getElementById('results-count');
  if (count) count.style.display = 'none';
  grid.innerHTML = Array(12).fill(
    `<div class="movie-card">
       <div class="skeleton movie-card-img"></div>
       <div class="skeleton" style="height:12px;margin-top:8px;border-radius:4px;"></div>
       <div class="skeleton" style="height:10px;margin-top:5px;width:60%;border-radius:4px;"></div>
     </div>`
  ).join('');
  try {
    const data = await searchMovies(query);
    renderResults(data.results, query, data.total_results);
  } catch (err) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">⚠️</div>
        <p>Something went wrong. Please try again.</p>
      </div>`;
  }
}
function renderResults(movies, query, total) {
  const grid  = document.getElementById('search-results');
  const count = document.getElementById('results-count');
  if (!movies.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🎬</div>
        <p>No results found for "<strong style="color:var(--txt)">${query}</strong>".</p>
        <a href="index.html">← Back to Home</a>
      </div>`;
    if (count) count.style.display = 'none';
    return;
  }
  if (count) {
    count.style.display = 'block';
    document.getElementById('results-num').textContent  = total.toLocaleString();
    document.getElementById('results-query').textContent = query;
  }
  grid.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img
        class="movie-card-img"
        src="${getPosterURL(movie.poster_path)}"
        alt="${movie.title}"
        loading="lazy"
      />
      <p class="movie-card-title">${movie.title}</p>
      <p class="movie-card-score">★ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
    `;
    card.addEventListener('click', () => openModal(movie.id));
    grid.appendChild(card);
  });
}
function showEmpty() {
  currentQuery = '';
  const count = document.getElementById('results-count');
  if (count) count.style.display = 'none';
  document.getElementById('search-results').innerHTML = `
    <div class="empty-state" style="grid-column:1/-1;">
      <div class="empty-icon">🔍</div>
      <p>Search for any movie by title, genre, or actor name.</p>
    </div>`;
}
