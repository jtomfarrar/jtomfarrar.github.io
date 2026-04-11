const pubRoot = document.querySelector('#pub-root');
const pubSearch = document.querySelector('#pub-search');
const pubCount = document.querySelector('#pub-count');

function extractYear(citation) {
  const years = citation.match(/(19|20)\d{2}/g);
  return years ? Number(years[years.length - 1]) : 0;
}

function extractLink(citation) {
  const doi = citation.match(/https?:\/\/(?:dx\.)?doi\.org\/[A-Za-z0-9._;()/:%-]+/i);
  if (doi) return doi[0];
  const bare = citation.match(/\b(10\.\d{4,9}\/[A-Za-z0-9._;()/:%-]+)\b/i);
  if (bare) return `https://doi.org/${bare[1]}`;
  const generic = citation.match(/https?:\/\/[A-Za-z0-9./?_=#:%-]+/i);
  return generic ? generic[0] : null;
}

function highlightCitation(citation, url) {
  if (!url) return citation;
  const clean = citation.replace(url, '').trim();
  return `${clean} `;
}

function renderPublications(publications) {
  if (!pubRoot) return;

  const visible = publications.slice(0, 24);
  pubRoot.innerHTML = '';
  visible.forEach((pub) => {
    const article = document.createElement('article');
    article.className = 'pub-card';

    const year = pub.year || extractYear(pub.citation);
    const url = extractLink(pub.citation);

    const title = document.createElement('h3');
    title.textContent = year ? String(year) : 'Publication';

    const p = document.createElement('p');
    p.className = 'pub-citation';
    p.textContent = highlightCitation(pub.citation, url);

    if (url) {
      const link = document.createElement('a');
      link.className = 'inline-link';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Read';
      p.appendChild(link);
    }

    article.appendChild(title);
    article.appendChild(p);
    pubRoot.appendChild(article);
  });

  if (pubCount) {
    const shown = Math.min(visible.length, publications.length);
    pubCount.textContent = `${publications.length} matching publications${publications.length > shown ? `, showing ${shown}` : ''}.`;
  }
}

function initPublications() {
  if (!pubRoot || !Array.isArray(window.CV_PUBLICATIONS)) return;

  const all = window.CV_PUBLICATIONS
    .filter((pub) => pub.section !== 'other')
    .map((pub) => ({ ...pub, year: extractYear(pub.citation) }))
    .sort((a, b) => b.year - a.year || a.number - b.number);

  renderPublications(all);

  if (!pubSearch) return;
  pubSearch.addEventListener('input', () => {
    const query = pubSearch.value.trim().toLowerCase();
    const filtered = !query
      ? all
      : all.filter((pub) => pub.citation.toLowerCase().includes(query));
    renderPublications(filtered);
  });
}

initPublications();
