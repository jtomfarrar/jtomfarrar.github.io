const pubSection = document.querySelector('#pub-sections');
const pubSearch = document.querySelector('#pub-search');
const pubCount = document.querySelector('#pub-count');

const EXTRA_DIRECT_LINKS = [
  {
    key: 'salinity and temperature balances at the spurs central mooring',
    url: 'https://tos.org/oceanography/article/salinity-and-temperature-balances-at-the-spurs-central-mooring-during-fall-',
  },
  {
    key: 'air-sea interaction in the bay of bengal',
    url: 'https://tos.org/oceanography/article/air-sea-interaction-in-the-bay-of-bengal',
  },
  {
    key: 'what controls seasonal evolution of sea surface temperature in the bay of bengal',
    url: 'https://tos.org/oceanography/article/what-controls-seasonal-evolution-of-sea-surface-temperature-in-the-b',
  },
  {
    key: 'modification of upper-ocean temperature structure by subsurface mixing',
    url: 'https://tos.org/oceanography/article/modification-of-upper-ocean-temperature-structure-by-subsurface-mixing',
  },
  {
    key: 'westward mountain-gap wind jets of the northern red sea as seen by quikscat',
    url: 'https://www.sciencedirect.com/science/article/pii/S0034425718300932',
  },
  {
    key: 'impact of freshwater plumes on intraseasonal upper ocean variability in the bay of bengal',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0967064517304010',
  },
  {
    key: 'the winds and currents mission concept',
    url: 'https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2019.00438/full',
  },
  {
    key: 'global observations of fine-scale ocean surface topography with the surface water and ocean topography',
    url: 'https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2019.00232/full',
  },
  {
    key: 'air-sea fluxes with a focus on heat and momentum',
    url: 'https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2019.00430/full',
  },
  {
    key: 'integrated observations and modeling of winds, currents, and waves',
    url: 'https://www.frontiersin.org/journals/marine-science/articles/10.3389/fmars.2019.00425/full',
  },
  {
    key: 'on the factors driving upper-ocean salinity variability at the western edge of the eastern pacific fresh pool',
    url: 'https://tos.org/oceanography/article/on-the-factors-driving-upper-ocean-salinity-variability-at-the-western-edge',
  },
  {
    key: 'novel and flexible approach to access the open ocean',
    url: 'https://tos.org/oceanography/article/novel-and-flexible-approach-to-access-the-open-ocean-uses-of-sailing',
  },
  {
    key: 'comparing air-sea flux measurements from a new unmanned surface vehicle',
    url: 'https://tos.org/oceanography/article/comparing-air-sea-flux-measurements-from-a-new-unmanned-surface-vehicle-and',
  },
  {
    key: 'a note on modeling mixing in the upper layers of the bay of bengal',
    url: 'https://www.sciencedirect.com/science/article/pii/S0967064519300657',
  },
  {
    key: 'submesoscale eddy contribution to ocean vertical heat flux diagnosed from airborne observations',
    url: 'https://doi.org/10.1029/2024GL112278',
  },
  {
    key: 'a new look at earth’s water, energy, and climate with swot',
    url: 'https://doi.org/10.1038/s44221-024-00372-w',
  },
  {
    key: 's-mode: the sub-mesoscale ocean dynamics experiment',
    url: 'https://doi.org/10.1175/BAMS-D-23-0178.1',
  },
  {
    key: 'atmospheric wind energization of ocean weather',
    url: 'https://doi.org/10.1038/s41467-025-56310-1',
  },
  {
    key: 'observations of a splitting ocean cyclone resulting in subduction of surface waters',
    url: 'https://doi.org/10.1126/sciadv.adu3221',
  },
  {
    key: 'airborne observations of fast-evolving oceansubmesoscale turbulence',
    url: 'https://doi.org/10.1038/s43247-024-01917-3',
  },
  {
    key: 'airborne observations of fast-evolving ocean submesoscale turbulence',
    url: 'https://doi.org/10.1038/s43247-024-01917-3',
  },
  {
    key: 'models of the sea-surface height expression of the internal-wave continuum',
    url: 'https://doi.org/10.1175/JPO-D-23-0178.1',
  },
  {
    key: 'ocean surface radiation measurement best practices',
    url: 'https://doi.org/10.3389/fmars.2024.1359149',
  },
  {
    key: 'near-inertial response of a salinity-stratified ocean',
    url: 'https://doi.org/10.1175/JPO-D-23-0173.1',
  },
  {
    key: 'submesoscale ocean dynamics experiment (s-mode) data submission report',
    url: 'https://doi.org/10.1575/1912/69362',
  },
  {
    key: 'evaluation of ocean currents observed from autonomous surface vehicles',
    url: 'https://doi.org/10.1175/JTECH-D-23-0066.1',
  },
  {
    key: 'the effects of uncorrelated measurement noise on swot estimates of sea-surface height, velocity and vorticity',
    url: 'https://doi.org/10.1175/JTECH-D-21-0167.1',
  },
  {
    key: 'longwave radiation corrections for the omni buoy network',
    url: 'https://doi.org/10.1175/JTECH-D-21-0069.1',
  },
  {
    key: 'moored turbulence measurements using pulse-coherent doppler sonar',
    url: 'https://doi.org/10.1175/JTECH-D-21-0005.1',
  },
  {
    key: 'long-distance radiation of rossby waves from the equatorial current system',
    url: 'https://doi.org/10.1175/JPO-D-20-0048.1',
  },
  {
    key: 'frontal convergence and vertical velocity measured by drifters in the alboran sea',
    url: 'https://doi.org/10.1029/2020JC016614',
  },
  {
    key: 'bay of bengal intraseasonal oscillations and the 2018 monsoon onset',
    url: 'https://doi.org/10.1175/BAMS-D-20-0113.1',
  },
  {
    key: 'a ka-band wind geophysical model function using doppler scatterometer measurements from the air-sea interaction tower experiment',
    url: 'https://doi.org/10.3390/rs14092067',
  },
];

const DIRECT_LINKS_BY_NUMBER = {
  5: 'https://doi.org/10.5194/os-22-443-2026',
  7: 'https://doi.org/10.1175/JPO-D-25-0134.1',
  8: 'https://doi.org/10.1175/BAMS-D-24-0174.1',
  9: 'https://doi.org/10.31223/X5SX30',
  11: 'https://doi.org/10.1175/JPO-D-24-0186.1',
  14: 'https://doi.org/10.5194/os-21-2915-2025',
  16: 'https://doi.org/10.1175/BAMS-D-23-0178.1',
  18: 'https://doi.org/10.1017/jfm.2025.356',
  27: 'https://doi.org/10.1073/pnas.2319937121',
  35: 'https://doi.org/10.1175/JTECH-D-22-0098.1',
  50: 'https://doi.org/10.3390/rs12111796',
  51: 'https://doi.org/10.1175/JPO-D-19-0212.1',
  52: 'https://doi.org/10.1175/JTECH-D-19-0176.1',
};

function normalizeLine(line) {
  return line.replace(/\u000c/g, '').trim();
}

function detectSection(line, current) {
  if (/^Manuscripts in review/i.test(line)) return 'review';
  if (/^Peer-reviewed articles/i.test(line)) return 'peer';
  if (/^Other publications/i.test(line)) return 'other';
  return current;
}

function parseCvPublications(text) {
  const lines = text.split('\n');
  const pubs = [];

  let currentSection = 'peer';
  let active = null;

  const pushActive = () => {
    if (!active) return;
    const cleaned = active.body
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,;:])/g, '$1')
      .replace(/Contributions:\s.*$/i, '')
      .trim();

    if (cleaned) {
      pubs.push({
        number: active.number,
        section: active.section,
        citation: cleaned,
      });
    }
    active = null;
  };

  for (const raw of lines) {
    const line = normalizeLine(raw);
    if (!line) continue;
    if (/^Conference\s*&\s*Workshop\s*Presentations/i.test(line)) break;
    if (/^Farrar:\s+February/i.test(line) || /^\d+\/24$/.test(line)) continue;

    currentSection = detectSection(line, currentSection);

    const m = line.match(/^\s*\[(\d+)\]\s*(.*)$/);
    if (m) {
      pushActive();
      active = {
        number: Number(m[1]),
        section: currentSection,
        body: (m[2] || '').trim(),
      };
      continue;
    }

    if (!active) continue;

    const previous = active.body;
    active.body = previous.endsWith('-')
      ? `${previous.slice(0, -1)}${line}`
      : `${previous} ${line}`;
  }

  pushActive();
  return pubs;
}

function extractYear(citation) {
  const years = citation.match(/(19|20)\d{2}/g);
  return years ? Number(years[years.length - 1]) : null;
}

function extractPrimaryUrl(citation) {
  const doiUrl = citation.match(/https?:\/\/(?:dx\.)?doi\.org\/[A-Za-z0-9._;()/:%-]+/i);
  if (doiUrl) return doiUrl[0];

  const doiPlain = citation.match(/(?:doi:\s*|DOI:\s*)(10\.\d{4,9}\/[A-Za-z0-9._;()/:%-]+)/i);
  if (doiPlain) return `https://doi.org/${doiPlain[1]}`;

  const doiBare = citation.match(/\b(10\.\d{4,9}\/[A-Za-z0-9._;()/:%-]+)\b/i);
  if (doiBare) return `https://doi.org/${doiBare[1]}`;

  const generic = citation.match(/https?:\/\/[A-Za-z0-9./?_=#:%-]+/i);
  if (generic) return generic[0];

  const aguEid = citation.match(/\be(19|20)\d{2}[A-Z]{2}\d{5,}\b/);
  if (aguEid) return `https://doi.org/10.1029/${aguEid[0].slice(1)}`;

  return null;
}

function extractMappedUrl(citation) {
  const lower = citation.toLowerCase();
  for (const item of EXTRA_DIRECT_LINKS) {
    if (lower.includes(item.key)) return item.url;
  }
  return null;
}

function getPrimaryLabel(url) {
  if (!url) return null;
  if (/doi\.org/i.test(url)) return 'doi';
  if (/\.pdf([?#].*)?$/i.test(url)) return 'pdf';
  return 'online';
}

function toItem(p) {
  const item = document.createElement('article');
  item.className = 'pub-item';

  const primaryUrl = DIRECT_LINKS_BY_NUMBER[p.number] || extractPrimaryUrl(p.citation) || extractMappedUrl(p.citation);

  const citation = document.createElement('p');
  citation.className = 'pub-citation';
  citation.textContent = `[${p.number}] ${p.citation}`;

  if (primaryUrl) {
    const primary = document.createElement('a');
    primary.href = primaryUrl;
    primary.target = '_blank';
    primary.rel = 'noopener';
    primary.textContent = 'link';
    primary.className = 'inline-link';
    citation.append(' ');
    citation.appendChild(primary);
  }

  item.appendChild(citation);

  item.dataset.text = `${p.number} ${p.section} ${p.citation}`.toLowerCase();
  return item;
}

function render(publications) {
  const ordered = [...publications]
    .filter((p) => p.section !== 'other')
    .map((p) => ({ ...p, year: extractYear(p.citation) || 0 }))
    .sort((a, b) => a.number - b.number);

  const inReview = ordered.filter((p) => p.section === 'review' || /\bsubmitted\b/i.test(p.citation));
  const published = ordered.filter((p) => !(p.section === 'review' || /\bsubmitted\b/i.test(p.citation)));

  pubSection.innerHTML = '';

  if (inReview.length) {
    const reviewWrap = document.createElement('section');
    reviewWrap.className = 'pub-year-group';
    reviewWrap.dataset.group = 'review';

    const h = document.createElement('h2');
    h.className = 'pub-year';
    h.textContent = 'Manuscripts in review';

    const list = document.createElement('div');
    list.className = 'pub-year-list';
    inReview.forEach((p) => list.appendChild(toItem(p)));

    reviewWrap.appendChild(h);
    reviewWrap.appendChild(list);
    pubSection.appendChild(reviewWrap);
  }

  const groups = new Map();
  published.forEach((p) => {
    const key = p.year ? String(p.year) : 'Undated';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  });

  const yearOrder = Array.from(groups.keys()).sort((a, b) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return Number(b) - Number(a);
  });

  yearOrder.forEach((yearKey) => {
    const wrap = document.createElement('section');
    wrap.className = 'pub-year-group';
    wrap.dataset.group = yearKey;

    const h = document.createElement('h2');
    h.className = 'pub-year';
    h.textContent = yearKey;

    const list = document.createElement('div');
    list.className = 'pub-year-list';

    groups.get(yearKey).forEach((p) => list.appendChild(toItem(p)));

    wrap.appendChild(h);
    wrap.appendChild(list);
    pubSection.appendChild(wrap);
  });

  const allItems = Array.from(pubSection.querySelectorAll('.pub-item'));
  const groupsEls = Array.from(pubSection.querySelectorAll('.pub-year-group'));

  pubCount.textContent = `${allItems.length} publications`;

  if (pubSearch) {
    pubSearch.addEventListener('input', () => {
      const q = pubSearch.value.trim().toLowerCase();
      let visible = 0;

      allItems.forEach((item) => {
        const show = !q || item.dataset.text.includes(q);
        item.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });

      groupsEls.forEach((g) => {
        const hasVisible = g.querySelector('.pub-item:not([style*="display: none"])');
        g.style.display = hasVisible ? '' : 'none';
      });

      pubCount.textContent = `${visible} matching publications`;
    });
  }
}

async function init() {
  if (!pubSection || !pubCount) return;
  if (Array.isArray(window.CV_PUBLICATIONS) && window.CV_PUBLICATIONS.length) {
    render(window.CV_PUBLICATIONS);
    return;
  }

  try {
    const response = await fetch('material/Tom_CV-6.txt', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const publications = parseCvPublications(text);
    render(publications);
  } catch (err) {
    pubCount.textContent = 'Unable to load publication list from CV text.';
    pubSection.innerHTML = `
      <article class="card">
        <h2>Load error</h2>
        <p>Could not parse <code>material/Tom_CV-6.txt</code>. Regenerate it from the PDF:</p>
        <pre><code>pdftotext -layout material/Tom_CV-6.pdf material/Tom_CV-6.txt</code></pre>
      </article>
    `;
  }
}

init();
