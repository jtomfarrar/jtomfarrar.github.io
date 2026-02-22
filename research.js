const sections = {
  swot: document.querySelector('#papers-swot'),
  smode: document.querySelector('#papers-smode'),
  buoys: document.querySelector('#papers-buoys'),
  usv: document.querySelector('#papers-usv'),
};

const EXCLUDED_PATTERNS = [
  /igarss\\s*2020/i,
  /lady amber/i,
];

const FEATURED_LIMITS = {
  swot: 6,
  smode: 3,
  buoys: 6,
  usv: 4,
};

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

const EXTRA_DIRECT_LINKS = [
  { key: 's-mode: the sub-mesoscale ocean dynamics experiment', url: 'https://doi.org/10.1175/BAMS-D-23-0178.1' },
  { key: 'submesoscale ocean dynamics experiment (s-mode) data submission report', url: 'https://doi.org/10.1575/1912/69362' },
  { key: 'the surface water and ocean topography mission: a breakthrough in radar remote sensing of the ocean and land surface water', url: 'https://doi.org/10.1029/2023GL107652' },
  { key: 'sub-100 km ocean processes revealed by structure functions of swot sea surface height', url: 'https://doi.org/10.1029/2025JC022639' },
  { key: 'swot mission validation of sea surface height measurements at sub-100 km scales', url: 'https://doi.org/10.1029/2025GL114936' },
  { key: 'on the development of swot in-situ calibration/validation', url: 'https://doi.org/10.1175/JTECH-D-22-0098.1' },
  { key: 'the effects of uncorrelated measurement noise on swot estimates of sea-surface height, velocity and vorticity', url: 'https://doi.org/10.1175/JTECH-D-21-0167.1' },
  { key: 'a ka-band wind geophysical model function', url: 'https://doi.org/10.3390/rs14092067' },
  { key: 'moored turbulence measurements using pulse-coherent doppler sonar', url: 'https://doi.org/10.1175/JTECH-D-21-0005.1' },
  { key: 'longwave radiation corrections for the omni buoy network', url: 'https://doi.org/10.1175/JTECH-D-21-0069.1' },
  { key: 'frontal convergence and vertical velocity measured by drifters in the alboran sea', url: 'https://doi.org/10.1029/2020JC016614' },
  { key: 'evaluation of ocean currents observed from autonomous surface vehicles', url: 'https://doi.org/10.1175/JTECH-D-23-0066.1' },
  { key: 'observing ocean-atmosphere fluxes from autonomous surface vehicles', url: 'https://doi.org/10.1029/2025GL115335' },
  { key: 'acoustic doppler current profiler measurements from saildrones with applications to submesoscale studies', url: 'https://doi.org/10.31223/X5SX30' },
  { key: 'novel and flexible approach to access the open ocean', url: 'https://tos.org/oceanography/article/novel-and-flexible-approach-to-access-the-open-ocean-uses-of-sailing' },
  { key: 'comparing air-sea flux measurements from a new unmanned surface vehicle', url: 'https://tos.org/oceanography/article/comparing-air-sea-flux-measurements-from-a-new-unmanned-surface-vehicle-and' },
  { key: 'salinity and temperature balances at the spurs central mooring', url: 'https://tos.org/oceanography/article/salinity-and-temperature-balances-at-the-spurs-central-mooring-during-fall-' },
  { key: 'air-sea interaction in the bay of bengal', url: 'https://tos.org/oceanography/article/air-sea-interaction-in-the-bay-of-bengal' },
  { key: 'asiri: an ocean-atmosphere initiative for bay of bengal', url: 'https://doi.org/10.1175/BAMS-D-14-00197.1' },
  { key: 'spurs-2: diagnosing the physics of a rainfall', url: 'https://spurs.jpl.nasa.gov/files/2014/10/SPURS-2-workshop-report.pdf' },
];

function extractYear(citation) {
  const years = citation.match(/(19|20)\d{2}/g);
  return years ? Number(years[years.length - 1]) : 0;
}

function extractPrimaryUrl(citation, number) {
  if (DIRECT_LINKS_BY_NUMBER[number]) return DIRECT_LINKS_BY_NUMBER[number];

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

  const lower = citation.toLowerCase();
  for (const item of EXTRA_DIRECT_LINKS) {
    if (lower.includes(item.key)) return item.url;
  }

  return null;
}

function toItem(pub) {
  const row = document.createElement('p');
  row.className = 'paper-item';
  row.textContent = `[${pub.number}] ${pub.citation}`;

  const url = extractPrimaryUrl(pub.citation, pub.number);
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'link';
    a.className = 'inline-link';
    row.append(' ');
    row.appendChild(a);
  }
  return row;
}

function matches(citation, pattern) {
  return pattern.test(citation.toLowerCase());
}

function renderList(target, title, publications) {
  if (!target) return;

  const wrap = document.createElement('div');
  wrap.className = 'paper-block';

  const h = document.createElement('h3');
  h.textContent = `${title} (${publications.length})`;
  wrap.appendChild(h);

  const list = document.createElement('div');
  list.className = 'paper-rows';
  publications.forEach((p) => list.appendChild(toItem(p)));

  wrap.appendChild(list);
  target.appendChild(wrap);
}

function renderFeatured(target, title, publications, limit) {
  if (!target || !limit) return;
  const picks = publications
    .filter((p) => !/\bsubmitted\b/i.test(p.citation))
    .slice(0, limit);
  if (!picks.length) return;
  renderList(target, title, picks);
}

function isExcludedCitation(citation) {
  return EXCLUDED_PATTERNS.some((pat) => pat.test(citation));
}

function initResearch() {
  const base = getPublicationsForResearch()
    .filter((p) => p.section !== 'other')
    .filter((p) => !isExcludedCitation(p.citation))
    .map((p) => ({ ...p, year: extractYear(p.citation) }))
    .sort((a, b) => b.year - a.year || a.number - b.number);

  const swot = base.filter((p) => matches(p.citation, /\bswot\b|surface water and ocean topography|short-wavelength ocean topography|sea surface height/));

  const smode = base.filter((p) => matches(p.citation, /\bs-mode\b|sub-?mesoscale ocean dynamics experiment/));

  const buoys = base.filter((p) =>
    matches(
      p.citation,
      /\bspurs\b|\basiri\b|\bbuoy\b|\bmoored\b|\bweller\b|pluedd?emann/,
    ),
  );

  const usv = base.filter((p) =>
    matches(
      p.citation,
      /\bgrare\b|\blenain\b|\bhodges\b|saildrone|wave glider|unmanned surface vehicle|autonomous surface vehicle/,
    ),
  );

  renderFeatured(sections.swot, 'Featured papers', swot, FEATURED_LIMITS.swot);
  renderList(sections.swot, 'All SWOT-related papers', swot);

  renderFeatured(sections.smode, 'Featured papers', smode, FEATURED_LIMITS.smode);
  renderList(sections.smode, 'All S-MODE-related papers', smode);

  renderFeatured(sections.buoys, 'Featured papers', buoys, FEATURED_LIMITS.buoys);
  renderList(sections.buoys, 'All buoy and mooring papers', buoys);

  renderFeatured(sections.usv, 'Featured papers', usv, FEATURED_LIMITS.usv);
  renderList(sections.usv, 'All USV and vehicle-based papers', usv);
}

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

function getPublicationsForResearch() {
  if (Array.isArray(window.CV_PUBLICATIONS) && window.CV_PUBLICATIONS.length) {
    return window.CV_PUBLICATIONS;
  }
  return [];
}

async function bootstrapResearch() {
  let loaded = getPublicationsForResearch();
  if (!loaded.length) {
    try {
      const response = await fetch('material/Tom_CV-6.txt', { cache: 'no-store' });
      if (response.ok) {
        const txt = await response.text();
        loaded = parseCvPublications(txt);
      }
    } catch {
      loaded = [];
    }
  }

  if (!loaded.length) {
    Object.values(sections).forEach((target) => {
      if (!target) return;
      const p = document.createElement('p');
      p.className = 'paper-item';
      p.textContent = 'Could not load publications data.';
      target.appendChild(p);
    });
    return;
  }

  window.CV_PUBLICATIONS = loaded;
  initResearch();
}

bootstrapResearch();
