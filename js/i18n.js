/* ============================================================
   言語切替。日本語は HTML がソース。英語だけ辞書で持つ。
   切替後に document へ 'langchange' を投げる（main.js が ScrollTrigger.refresh する）。
   ============================================================ */
(function () {
  var EN = {
    meta: { description: 'Portfolio of Yuya Itonaga, third-year engineering student at Keio University and head of Technophere. Started writing game guides in junior high; the media he runs has passed 19 million page views. Builds apps like BrawlTech, KPass and ZeroShot, and WordPress plugins.' },
    nav: { top: 'Back to top', chapters: 'Chapters', theme: 'Dark mode', menu: 'Menu', story: 'Beginnings', numbers: 'Numbers', works: 'Work', media: 'Media', tools: 'Tools', contact: 'Contact' },
    cover: {
      statement: 'Write it, build it, ship it.<br>I make media with 19 million page views and apps that live in the App Store.',
      role: 'Third-year, Faculty of Science and Technology, Keio University / Head of Technophere',
      cue: 'Scroll'
    },
    story: {
      title: 'Beginnings',
      p1: 'My first readers were people stuck on the same game as me. In 2021 I began running strategy sites on Gamerch, and the next year I wrote more than 100 articles as a contract writer for Gamepedia.',
      p2: 'In August 2023, in my last year of high school, I founded Technophere. Game-guide media is the core; SEO and analytics grew the readership, and now I ship my own apps and plugins too. Design, implementation, store release, post-launch iteration: I do all of it myself. AI sits at the center of how I build, and the last eyes on the code are mine.',
      photoAlt: 'Yuya Itonaga sitting in the lounge at Yagami Campus'
    },
    tl: {
      '2018_04': 'Enrolled at Keio Shonan Fujisawa Junior High School',
      '2021_01': 'Started running several game strategy sites on <a href="https://gamerch.com/" target="_blank" rel="noopener noreferrer">Gamerch</a>',
      '2021_04': 'Enrolled at Keio Shonan Fujisawa Senior High School',
      '2022_02': 'Wrote 100+ articles as a contract writer for <a href="https://gamepedia.jp/" target="_blank" rel="noopener noreferrer">Gamepedia</a>',
      '2023_08': 'Founded Technophere',
      '2024_03': "Won the Principal's Award for a school film shot with drones",
      '2024_04': 'Enrolled at Keio University, Faculty of Science and Technology',
      '2024_06': 'Started an internship at Taiziii, a startup',
      '2025_08': 'Released BrawlTech, a Brawl Stars strategy app',
      '2025_09': 'Started building websites for businesses',
      '2025_12': 'Released KPass, a study app for Keio students',
      '2026_04': 'Started as a DX mentor at Life is Tech!',
      '2026_07a': 'Started as an iPhone app development mentor for teens at Life is Tech! (100+ hours of training)',
      '2026_07b': 'Appointed Google AI Student Ambassador',
      nowYear: 'Now',
      now: 'Third-year, Department of System Design Engineering, Keio University'
    },
    numbers: {
      title: 'Numbers', lead: 'Measured across all the media I run.',
      peakLabel: 'Best month, page views', peakNote: 'May 2024, all sites',
      totalLabel: 'Page views to date', totalNote: 'August 2023 to September 2026',
      usersLabel: 'Best month, users', usersNote: 'May 2024, Brawl Stars Lab',
      clicksLabel: 'Search clicks, last 28 days', clicksNote: 'game.technophere.com. 3.09M impressions, average position 6.4',
      note: 'As of September 24, 2026. Google Analytics and Search Console.'
    },
    works: {
      title: 'Work', lead: 'Apps in the stores, and services and plugins I have published.',
      brawltech: { what: 'A strategy companion for Brawl Stars', desc: "Pulls live match records and brawler stats from Supercell's official API and third-party APIs, and pairs them with guides. Built in Flutter for iOS and Android at once, released in August 2025." },
      kpass: { what: 'Classes and assignments in one place for Keio students', desc: "Reads courses, assignments and timetables from the university's K-LMS (Canvas) API and lays them out inside the app. Keeps you logged in for days and shows deadlines at a glance. Built in SwiftUI, released in December 2025. Rated 4.4 on the App Store (173 ratings)." },
      zeroshot: { what: 'A camera that shoots portrait and landscape at once', desc: 'One tap of the shutter saves both a portrait and a landscape frame. From the frames around the shot, it picks the one with the least blur and no closed eyes, on the device, and saves it to your library. Tighter crops and other lenses are kept too, so you can choose again after the fact. Built in SwiftUI and AVFoundation, released in September 2026.', alt0: 'ZeroShot camera screen, capturing portrait and landscape at once', alt1: 'ZeroShot candidates screen, with the best shot picked automatically' },
      mimishare: { desc: 'Rent a Disney headband for just the day of your visit. Reserve with a deposit, borrow and return by QR code. Built alone in Next.js and Stripe, from catalog to checkout.' },
      more: 'More',
      alg: { desc: 'A WordPress plugin that generates App Store and Google Play links from the block editor. Published in the official WordPress.org directory.' },
      pfg: { desc: 'A WordPress plugin that deploys your own themes and plugins from a linked GitHub repository with one click in the admin.' },
      lemon: { desc: 'An AI platform for Lemon, the engineering club at Keio. A mentor that answers around the clock and an idea gacha. I built the frontend and UI in a team.' }
    },
    media: {
      title: 'Media I run', lead: 'One WordPress site per game, with encyclopedias and rankings updated automatically from official APIs and game data. The core of Technophere.',
      hubLink: 'Open game.technophere.com',
      labs: {
        brawlstars: 'Brawler tier list and win rates by map and mode', tsumtsum: 'Gacha news and Tsum rankings', msfs: 'Aircraft encyclopedia, add-ons and airport data',
        efootball: 'Player and manager database with a training simulator', clashroyale: 'Card encyclopedia and deck usage and win rates from the official API',
        cs: 'City-building guides and mods', nte: 'Character and disc stats and gacha schedule, auto-updated from game data',
        blog: 'A blog on tech and everyday life', app: 'A gallery of Technophere apps and their docs'
      }
    },
    tools: {
      title: 'Tools', p1: 'AI sits at the center of my workflow. I run Claude Code, Cursor and Antigravity side by side and pick the model that fits each project. Build fast, then read the code with my own eyes.',
      p2: 'Apps in Swift and Flutter, the web in WordPress and Next.js. I check the numbers in Search Console and Analytics every day.',
      app: 'Apps', infra: 'Infra', growth: 'Growth', other: 'Also', otherValue: 'Video editing, drone piloting'
    },
    contact: {
      title: 'The next idea', lead: 'If you want to make something interesting together, write to me. Work, or just a chat, by email or on X.',
      biz: 'I also build websites for businesses. <a href="https://technophere.com/web-production/" target="_blank" rel="noopener noreferrer">About the service</a>'
    },
    footer: { copy: '© 2026 Yuya Itonaga / Technophere' }
  };

  var ja = { text: {}, html: {}, aria: {}, alt: {}, meta: '' };
  function get(obj, key) { return key.split('.').reduce(function (o, k) { return o && o[k] !== undefined ? o[k] : undefined; }, obj); }

  function cacheJa() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) { if (!(el.dataset.i18n in ja.text)) ja.text[el.dataset.i18n] = el.textContent; });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { if (!(el.dataset.i18nHtml in ja.html)) ja.html[el.dataset.i18nHtml] = el.innerHTML; });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { if (!(el.dataset.i18nAria in ja.aria)) ja.aria[el.dataset.i18nAria] = el.getAttribute('aria-label') || ''; });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) { if (!(el.dataset.i18nAlt in ja.alt)) ja.alt[el.dataset.i18nAlt] = el.getAttribute('alt') || ''; });
    var m = document.querySelector('meta[name="description"]'); if (m) ja.meta = m.getAttribute('content') || '';
  }

  function setLang(lang) {
    var en = lang === 'en';
    document.documentElement.lang = lang;
    try { localStorage.setItem('lang', lang); } catch (e) {}
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var v = en ? get(EN, el.dataset.i18n) : ja.text[el.dataset.i18n]; if (v !== undefined) el.textContent = v; });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) { var v = en ? get(EN, el.dataset.i18nHtml) : ja.html[el.dataset.i18nHtml]; if (v !== undefined) el.innerHTML = v; });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { var v = en ? get(EN, el.dataset.i18nAria) : ja.aria[el.dataset.i18nAria]; if (v !== undefined) el.setAttribute('aria-label', v); });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) { var v = en ? get(EN, el.dataset.i18nAlt) : ja.alt[el.dataset.i18nAlt]; if (v !== undefined) el.setAttribute('alt', v); });
    var m = document.querySelector('meta[name="description"]'); if (m) m.setAttribute('content', en ? EN.meta.description : ja.meta);
    var btn = document.getElementById('langToggle');
    if (btn) { btn.querySelector('span').textContent = en ? 'JA' : 'EN'; btn.setAttribute('aria-label', en ? '日本語に切り替える' : 'Switch to English'); }
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  document.addEventListener('DOMContentLoaded', function () {
    cacheJa();
    if (document.documentElement.getAttribute('data-lang-pending') === 'en') { setLang('en'); document.documentElement.removeAttribute('data-lang-pending'); }
    var btn = document.getElementById('langToggle');
    if (btn) btn.addEventListener('click', function () { setLang(document.documentElement.lang === 'en' ? 'ja' : 'en'); });
  });
  window.setLang = setLang;
})();
