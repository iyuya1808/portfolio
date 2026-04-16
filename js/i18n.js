/* ============================================================
   i18n — Language switch logic
   ============================================================
   設計方針:
   - 日本語テキストは HTML がソース。translations.ja は不要。
   - DOMContentLoaded 時に [data-i18n] 要素の初期値を jaCache へ保存。
   - JA 切り替え時は jaCache から復元 → HTML を更新するだけで JA 側は自動追従。
   - EN 翻訳のみ enTranslations で管理。
   ============================================================ */

/* ---- JA typewriter phrases (DOM に存在しないため個別管理) ---- */
var jaPhrases = [
  'AI × エンジニア × コンテンツクリエイター',
  'フルスタック開発 × SEO × アプリケーション',
  '慶應大在学中 × テクノフィア代表'
];

/* ---- EN translations ---- */
var enTranslations = {
  meta: {
    description: 'Portfolio of Yuya Itonaga, Head of Technophere. An AI engineer and student at Keio University. Runs media sites with up to 1.5M monthly page views and builds apps.'
  },
  nav: {
    ariaLabel: 'Main navigation',
    logo: { ariaLabel: 'Back to top' },
    hamburger: { ariaLabel: 'Open menu' },
    overlay: { ariaLabel: 'Mobile navigation' }
  },
  hero: {
    badge: 'Head of Technophere · Product Creator',
    mission: '"Making the world more exciting with cutting-edge technology"——<br>From web media to app development, I place the latest AI at the core of every build, turning ideas into products at the speed of thought.'
  },
  about: {
    title: 'About Me',
    bio: {
      wsm: {
        p1: 'By consistently publishing on topics like SEO, analytics, and content strategy, I grew Technophere — my own web media brand — to 1.5 million monthly page views.',
        p2: 'I run data-driven PDCA cycles to maximize organic search traffic and boost engagement.'
      },
      ai: {
        p1: 'I place the latest AI at the core of the development process, selecting the right model for each project to balance speed and quality. Every project is built through close human–AI collaboration.'
      },
      fullstack: {
        p1: 'I have end-to-end experience — from tech selection and MVP development with Flutter, Swift, Next.js, and WordPress, to App Store releases, closed beta testing, and iterating on user feedback.'
      }
    },
    info: {
      affiliationLabel: 'Affiliation',
      affiliationValue: 'Keio University, Faculty of Science<br>and Technology',
      businessLabel: 'Business',
      businessValue: 'Head of Technophere',
      foundedLabel: 'Founded',
      foundedValue: 'August 2023'
    },
    timeline: {
      '2018_04': 'Enrolled in Keio Shonan Fujisawa Junior High School',
      '2021_01': 'Started managing several game strategy sites on <a href="https://gamerch.com/" class="timeline-link" target="_blank" rel="noopener noreferrer">Gamerch</a>',
      '2021_04': 'Enrolled in Keio Shonan Fujisawa Senior High School',
      '2022_02': 'Contributed 100+ articles as a dedicated writer (contract) for <a href="https://gamepedia.jp/" class="timeline-link" target="_blank" rel="noopener noreferrer">Gamepedia</a>',
      '2023_08': 'Founded Technophere',
      '2024_03': "Won the Principal's Award for a school intro video using drone aerial photography",
      '2024_04': 'Enrolled at Keio University, Faculty of Science and Technology',
      '2024_06': 'Started internship at Taiziii',
      '2025_08': 'Launched BrawlTech — a Brawl Stars strategy & stats app',
      '2025_09': 'Launched web development agency services for businesses',
      '2025_12': 'Launched KPass — a study support app for Keio students',
      '2026_04': 'Started as a DX Mentor at Life is Tech!',
      presentYear: 'Present',
      present: 'Currently enrolled at Keio University, Department of System Design Engineering'
    }
  },
  numbers: {
    title: 'Numbers',
    subtitle: 'Results within the first 8 months of founding Technophere',
    kpi: {
      uuLabel: 'Monthly Unique Users',
      pvLabel: 'Monthly Page Views',
      rankLabel: 'Avg. Search Position',
      rankUnit: '',
      ctrLabel: 'Click-Through Rate'
    }
  },
  works: {
    title: 'Products',
    brawltech: { desc: "A strategy and stats app for the action game 'Brawl Stars'. Provides real-time data and character guides using Supercell's official API and third-party APIs. Supports iOS and Android via Flutter." },
    kpass: { desc: "A study support app for Keio students. Fetches data from the official learning platform 'K-LMS (Canvas)' API and displays it in an organized view. Features persistent login sessions and assignment tracking." },
    mimishare: { desc: 'A headband rental service for Disneyland visitors. Far cheaper than buying one for a single visit. Simple flow: deposit-based reservation → borrow and return via QR code.' },
    applinkgenerator: { desc: 'A WordPress plugin that generates and inserts App Store / Google Play links directly from the block editor. Streamlines writing app review articles.' },
    pushfromgithub: { desc: 'A plugin that deploys (updates) your own WordPress themes and plugins linked to a GitHub repository with one click. Easy CI/CD for WordPress.' },
    consoleinsight: { desc: 'A tool that visualizes Google Search Console data in a clear, intuitive way. A dashboard app to streamline SEO operations.' },
    vibestep: { desc: 'A mobile app delivering interactive experiences synchronized to music. An entertainment product focused on unique UI/UX experiences.' },
    lemonai: { desc: 'An AI platform exclusively for the Keio University engineering club "Lemon". Features a 24/7 AI mentor, a virtual clubroom dashboard, and an Idea Gacha (random idea generator) system. Restricted to club members via @keio.jp authentication and invite-only access. Responsible for frontend development & UI/UX in team development.' }
  },
  media: {
    title: 'Media',
    techlog: {
      title: 'Techlog',
      desc: 'A general-purpose media covering WordPress, SEO, and app development, along with entertainment and lifestyle topics.'
    },
    gamelab: {
      title: 'Strategy Lab',
      desc: "Technophere's flagship media — a collection of ~7 game strategy sites. Built on game knowledge accumulated since junior high, reaching hundreds of thousands of monthly page views."
    },
    author: 'Technophere'
  },
  services: {
    title: 'B2B Services',
    subtitle: 'Web development & custom projects for individuals and businesses',
    web: {
      title: 'Website Development',
      desc: 'We build corporate sites, landing pages, and media sites using WordPress, handling everything from SEO optimization to page speed improvements.',
      cta: 'Learn more'
    },
    other: {
      title: 'Other & Flexible Requests',
      desc: 'From writing product review articles to a wide variety of other projects beyond web development. Feel free to reach out for a consultation.',
      cta: 'Consult us'
    }
  },
  skills: {
    title: 'Tech Stack',
    chips: {
      videoEditing: 'Video Editing',
      dronePiloting: 'Drone Piloting'
    }
  },
  contact: {
    title: 'Contact',
    subtitle: 'For inquiries, collaborations, or questions, feel free to reach out.',
    emailLabel: 'Email',
    emailAriaLabel: 'Send an email',
    siteLabel: 'Official Site',
    siteAriaLabel: 'Open Technophere official site'
  },
  footer: {
    copy: '© 2026 Yuya Itonaga / Technophere',
    cacheClear: 'Clear Cache & Reset'
  },
  typewriter: {
    phrases: [
      'AI Engineer · Content Creator',
      'Full-Stack Dev · SEO · App Builder',
      'Keio University · Head of Technophere'
    ]
  }
};

/* ---- JA DOM cache (初期HTML値を保存) ---- */
var jaCache = {
  text: {},   /* data-i18n key  → textContent */
  html: {},   /* data-i18n-html key → innerHTML */
  aria: {},   /* data-i18n-aria key → aria-label (配列: 同一キーが複数要素に使われる場合も想定) */
  meta: ''    /* meta[name=description] content */
};

function cacheJaDOM() {
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.dataset.i18n;
    if (!(key in jaCache.text)) {
      jaCache.text[key] = el.textContent;
    }
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    var key = el.dataset.i18nHtml;
    if (!(key in jaCache.html)) {
      jaCache.html[key] = el.innerHTML;
    }
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    var key = el.dataset.i18nAria;
    if (!(key in jaCache.aria)) {
      jaCache.aria[key] = el.getAttribute('aria-label') || '';
    }
  });
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) jaCache.meta = metaDesc.getAttribute('content') || '';
}

/* ---- helpers ---- */
function getNestedValue(obj, key) {
  return key.split('.').reduce(function (o, k) {
    return (o && o[k] !== undefined) ? o[k] : undefined;
  }, obj);
}

/* ---- count-up lang update ---- */
function updateCountUpLang(lang) {
  document.querySelectorAll('.count-up').forEach(function (el) {
    delete el.dataset.animated;
    var rect = el.getBoundingClientRect();
    var inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView && typeof window.i18nAnimateCount === 'function') {
      el.dataset.animated = 'true';
      window.i18nAnimateCount(el);
    }
  });
}

/* ---- main switch function ---- */
function setLang(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);

  if (lang === 'ja') {
    /* JA: DOM キャッシュから復元 */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var cached = jaCache.text[el.dataset.i18n];
      if (cached !== undefined) el.textContent = cached;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var cached = jaCache.html[el.dataset.i18nHtml];
      if (cached !== undefined) el.innerHTML = cached;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var cached = jaCache.aria[el.dataset.i18nAria];
      if (cached !== undefined) el.setAttribute('aria-label', cached);
    });
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && jaCache.meta) metaDesc.setAttribute('content', jaCache.meta);

    /* typewriter */
    if (typeof window.updateTypewriterPhrases === 'function') {
      window.updateTypewriterPhrases(jaPhrases);
    } else {
      window.i18nPhrases = jaPhrases;
    }
  } else {
    /* EN: enTranslations を適用 */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var text = getNestedValue(enTranslations, el.dataset.i18n);
      if (text !== undefined) el.textContent = text;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var html = getNestedValue(enTranslations, el.dataset.i18nHtml);
      if (html !== undefined) el.innerHTML = html;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var text = getNestedValue(enTranslations, el.dataset.i18nAria);
      if (text !== undefined) el.setAttribute('aria-label', text);
    });
    var metaDescEN = document.querySelector('meta[name="description"]');
    if (metaDescEN) metaDescEN.setAttribute('content', enTranslations.meta.description);

    /* typewriter */
    if (typeof window.updateTypewriterPhrases === 'function') {
      window.updateTypewriterPhrases(enTranslations.typewriter.phrases);
    } else {
      window.i18nPhrases = enTranslations.typewriter.phrases;
    }
  }

  /* lang toggle label */
  var btn = document.getElementById('langToggle');
  if (btn) {
    btn.querySelector('.lang-toggle-label').textContent = lang === 'ja' ? 'EN' : 'JA';
  }

  /* count-up re-animation */
  updateCountUpLang(lang);
}

/* ---- initialization ---- */
document.addEventListener('DOMContentLoaded', function () {
  /* 1. 初期DOM (JA) をキャッシュ */
  cacheJaDOM();

  /* 2. 保存済み言語があれば適用 */
  var stored = localStorage.getItem('lang');
  if (stored && stored !== 'ja') {
    setLang(stored);
  }

  /* 3. 言語ボタンの初期ラベルとクリックイベント */
  var btn = document.getElementById('langToggle');
  if (btn) {
    var currentLang = document.documentElement.lang || 'ja';
    btn.querySelector('.lang-toggle-label').textContent = currentLang === 'ja' ? 'EN' : 'JA';

    btn.addEventListener('click', function () {
      var current = document.documentElement.lang || 'ja';
      setLang(current === 'ja' ? 'en' : 'ja');
    });
  }
});
