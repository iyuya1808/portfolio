/* ============================================================
   i18n — Translation dictionary + language switch logic
   ============================================================ */

var translations = {
  ja: {
    meta: {
      description: 'Yuya Itonaga（テクノフィア代表）のポートフォリオ。慶應義塾大学在学中のAIエンジニア。最高月間150万PVのメディアの運営やアプリ開発をしている。'
    },
    nav: {
      ariaLabel: 'メインナビゲーション',
      logo: { ariaLabel: 'トップへ戻る' },
      hamburger: { ariaLabel: 'メニューを開く' },
      overlay: { ariaLabel: 'モバイルナビゲーション' }
    },
    hero: {
      badge: 'テクノフィア代表 / プロダクトクリエイター',
      mission: '「最新テクノロジーで世界をもっと面白く」——<br>Webサイト運営やアプリ開発をはじめとし、最新のAI技術を開発プロセスの核に据え、思考の速度でプロダクトを形に。'
    },
    about: {
      title: '私について',
      bio: {
        wsm: {
          p1: 'コンテンツ運用・SEO対策・アクセス解析を軸に、継続的な情報発信を続けることで、独自のWebメディア「テクノフィア」で月間150万PVを達成。',
          p2: 'データを起点にPDCAを回し、検索流入の最大化とエンゲージメント向上を実現しています。'
        },
        ai: {
          p1: '最新のAI技術を開発プロセスの中枢に据え、プロジェクトに最適なモデルを選定しながら「AI駆動型開発」で開発速度と品質を最大化。自分の目でコードレビューを行い、AIと人間の協働による最高のアウトプットを追求しています。'
        },
        fullstack: {
          p1: 'FlutterやSwift、Next.js、WordPressなどの技術選定からMVP構築、さらにアプリストア公開、クローズドテスト実施、ユーザーフィードバックに基づく改善まで、リリース後の全工程を一通り経験しています。'
        }
      },
      info: {
        affiliationLabel: '所属',
        affiliationValue: '慶應義塾大学 理工学部<br>システムデザイン工学科',
        businessLabel: '事業',
        businessValue: 'テクノフィア 代表',
        foundedLabel: '設立',
        foundedValue: '2023年8月'
      },
      timeline: {
        '2018_04': '慶應義塾湘南藤沢中等部 入学',
        '2021_01': '<a href="https://gamerch.com/" class="timeline-link" target="_blank" rel="noopener noreferrer">Gamerch</a> で数種類のゲーム攻略サイトの運営を開始',
        '2021_04': '慶應義塾湘南藤沢高等部 入学',
        '2022_02': '<a href="https://gamepedia.jp/" class="timeline-link" target="_blank" rel="noopener noreferrer">攻略大百科</a>の専属ライター（業務委託）として100記事以上を寄稿',
        '2023_08': 'テクノフィア 設立',
        '2024_03': 'ドローン空撮を用いた学校紹介ムービー制作で「高等部部長賞」受賞',
        '2024_04': '慶應義塾大学 理工学部 入学',
        '2024_06': 'ベンチャー企業「株式会社Taiziii」にてインターン開始',
        '2025_08': 'ブロスタ戦略サポートアプリ「BrawlTech」リリース',
        '2025_09': '企業向け Web サイト制作代行サービスを開始',
        '2025_12': '慶應生向けの学習サポートアプリ「KPass」をリリース',
        presentYear: '現在',
        present: '慶應義塾大学理工学部 システムデザイン工学科 在学中'
      }
    },
    numbers: {
      title: '数字で見る実績',
      subtitle: 'テクノフィア設立8ヶ月で達成したKPI',
      kpi: {
        uuLabel: '月間ユニークユーザー',
        pvLabel: '月間ページビュー',
        rankLabel: 'Google 平均掲載順位',
        rankUnit: '位',
        ctrLabel: 'クリック率 (CTR)'
      }
    },
    works: {
      title: 'プロダクト',
      brawltech: { desc: 'アクションゲーム「ブロスタ」の攻略・統計アプリ。Supercell公式のAPIや外部APIを使用し、リアルタイムデータ表示とキャラクター攻略情報を提供。Flutter で iOS/Android 両対応。' },
      kpass: { desc: '慶應生向け学習サポートアプリ。公式の学習支援サービス「K-LMS（Canvas）」のAPIから情報を取得し、アプリ内で整理された状態で表示。数日のログイン保持機能と課題チェックが売り。' },
      mimishare: { desc: 'ディズニーランド利用者向けカチューシャレンタルサービス。来園の1回だけのためにカチューシャを購入するよりも断然お得。「デポジット制の予約→QRコードで貸出と返却」という簡単フロー。' },
      applinkgenerator: { desc: 'App Store / Google Play のアプリリンクをブロックエディタから簡単に生成・挿入できる WordPress プラグイン。アプリ紹介記事の作成を効率化。' },
      pushfromgithub: { desc: 'GitHub リポジトリと連携している自作の WordPress テーマ・プラグインをワンクリックでデプロイ（更新）できるプラグイン。CI/CD を WordPress に手軽に導入。' },
      consoleinsight: { desc: 'Google Search Console のデータをわかりやすく可視化するツール。SEO 運用を効率化するダッシュボードアプリ。' },
      vibestep: { desc: '音楽に合わせたインタラクティブな体験を提供するモバイルアプリ。ユニークな UI/UX を追求したエンターテインメント系プロダクト。' }
    },
    media: {
      title: '運営メディア',
      techlog: {
        title: 'テクログ',
        desc: 'WordPress・SEO・アプリ開発などの技術情報に加え、エンターテイメントやライフスタイルまで幅広いテーマで発信する総合メディア。'
      },
      gamelab: {
        title: '攻略 Lab',
        desc: 'テクノフィアの主力メディア。約7つのゲーム攻略サイトを傘下に持つゲームメディアグループ。中学生の頃から培った攻略の知見を活かし、月間数十万 PV を達成。'
      },
      author: 'テクノフィア'
    },
    services: {
      title: 'B2B サービス',
      subtitle: '個人 / 企業様向けの Web 制作・その他依頼',
      web: {
        title: 'Web サイト制作',
        desc: 'WordPress をベースにしたコーポレートサイト・LP・メディアサイトを制作。SEO 最適化・表示速度改善まで一貫して対応。',
        cta: '詳しく見る'
      },
      other: {
        title: 'その他・柔軟対応',
        desc: '商品レビュー記事の執筆など、Web 制作に限らずさまざまな案件に対応。まずはお気軽にご相談ください。',
        cta: '相談する'
      }
    },
    skills: {
      title: '技術スタック',
      chips: {
        videoEditing: '動画編集',
        dronePiloting: 'ドローン操縦'
      }
    },
    contact: {
      title: '連絡先',
      subtitle: 'ご依頼・コラボ・ご質問など、お気軽にご連絡ください。',
      emailLabel: 'メール',
      emailAriaLabel: 'メールを送る',
      siteLabel: '公式サイト',
      siteAriaLabel: 'テクノフィア公式サイトを開く'
    },
    footer: {
      copy: '© 2026 Yuya Itonaga / テクノフィア'
    },
    typewriter: {
      phrases: [
        'AI × エンジニア × コンテンツクリエイター',
        'フルスタック開発 × SEO × アプリケーション',
        '慶應大在学中 × テクノフィア代表'
      ]
    }
  },

  en: {
    meta: {
      description: 'Portfolio of Yuya Itonaga, CEO of Technophere. AI engineer at Keio University. Runs media sites with up to 1.5M monthly PV and builds apps.'
    },
    nav: {
      ariaLabel: 'Main navigation',
      logo: { ariaLabel: 'Back to top' },
      hamburger: { ariaLabel: 'Open menu' },
      overlay: { ariaLabel: 'Mobile navigation' }
    },
    hero: {
      badge: 'CEO of Technophere / Product Creator',
      mission: '"Making the world more exciting with cutting-edge technology"——<br>From web media to app development, I place the latest AI at the core of every build, turning ideas into products at the speed of thought.'
    },
    about: {
      title: 'About Me',
      bio: {
        wsm: {
          p1: 'By consistently publishing content centered on content operations, SEO, and analytics, I grew Technophere — my own web media brand — to 1.5 million monthly page views.',
          p2: 'I run data-driven PDCA cycles to maximize organic search traffic and boost engagement.'
        },
        ai: {
          p1: 'I place the latest AI at the core of the development process, selecting the optimal model for each project to maximize speed and quality through "AI-driven development." I personally review every line of code, pursuing the best output through human–AI collaboration.'
        },
        fullstack: {
          p1: 'I have end-to-end experience — from tech selection and MVP development with Flutter, Swift, Next.js, and WordPress, to App Store releases, closed beta testing, and iterating on user feedback.'
        }
      },
      info: {
        affiliationLabel: 'Affiliation',
        affiliationValue: 'Keio University, Faculty of Science<br>and Technology',
        businessLabel: 'Business',
        businessValue: 'CEO of Technophere',
        foundedLabel: 'Founded',
        foundedValue: 'August 2023'
      },
      timeline: {
        '2018_04': 'Enrolled in Keio Shonan Fujisawa Junior High School',
        '2021_01': 'Started managing several game strategy sites on <a href="https://gamerch.com/" class="timeline-link" target="_blank" rel="noopener noreferrer">Gamerch</a>',
        '2021_04': 'Enrolled in Keio Shonan Fujisawa Senior High School',
        '2022_02': 'Contributed 100+ articles as a dedicated writer (contract) for <a href="https://gamepedia.jp/" class="timeline-link" target="_blank" rel="noopener noreferrer">Koryaku Daihyakka</a>',
        '2023_08': 'Founded Technophere',
        '2024_03': "Won the Principal's Award for a school intro video using drone aerial photography",
        '2024_04': 'Enrolled at Keio University, Faculty of Science and Technology',
        '2024_06': "Started internship at venture company 'Taiziii Co., Ltd.'",
        '2025_08': 'Launched BrawlTech — a Brawl Stars strategy & stats app',
        '2025_09': 'Launched web development agency services for businesses',
        '2025_12': 'Launched KPass — a study support app for Keio students',
        presentYear: 'Present',
        present: 'Currently enrolled at Keio University, Dept. of System Design Engineering'
      }
    },
    numbers: {
      title: 'Numbers',
      subtitle: 'KPIs achieved within 8 months of founding Technophere',
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
      kpass: { desc: "A study support app for Keio students. Fetches data from the official learning platform 'K-LMS (Canvas)' API and displays it in an organized view. Features multi-day session persistence and assignment tracking." },
      mimishare: { desc: 'A headband rental service for Disneyland visitors. Far cheaper than buying one for a single visit. Simple flow: deposit-based reservation → borrow and return via QR code.' },
      applinkgenerator: { desc: 'A WordPress plugin that generates and inserts App Store / Google Play links directly from the block editor. Streamlines writing app review articles.' },
      pushfromgithub: { desc: 'A plugin that deploys (updates) your own WordPress themes and plugins linked to a GitHub repository with one click. Easy CI/CD for WordPress.' },
      consoleinsight: { desc: 'A tool that visualizes Google Search Console data in a clear, intuitive way. A dashboard app to streamline SEO operations.' },
      vibestep: { desc: 'A mobile app delivering interactive experiences synchronized to music. An entertainment product pursuing unique UI/UX.' }
    },
    media: {
      title: 'Media',
      techlog: {
        title: 'Techlog',
        desc: 'A general-purpose media covering WordPress, SEO, and app development, along with entertainment and lifestyle topics.'
      },
      gamelab: {
        title: 'Strategy Lab',
        desc: "Technophere's flagship media — a game media group with around 7 strategy sites. Leveraging game knowledge built since junior high, it has reached hundreds of thousands of monthly page views."
      },
      author: 'Technophere'
    },
    services: {
      title: 'B2B Services',
      subtitle: 'Web development & other requests for individuals and businesses',
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
      copy: '© 2026 Yuya Itonaga / Technophere'
    },
    typewriter: {
      phrases: [
        'AI Engineer × Content Creator',
        'Full-Stack Dev × SEO × App Builder',
        'Keio University × CEO of Technophere'
      ]
    }
  }
};

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

  /* text content */
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.dataset.i18n;
    var text = getNestedValue(translations[lang], key);
    if (text !== undefined) el.textContent = text;
  });

  /* innerHTML (elements with links / <br>) */
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    var key = el.dataset.i18nHtml;
    var html = getNestedValue(translations[lang], key);
    if (html !== undefined) el.innerHTML = html;
  });

  /* aria-label */
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    var key = el.dataset.i18nAria;
    var text = getNestedValue(translations[lang], key);
    if (text !== undefined) el.setAttribute('aria-label', text);
  });

  /* meta description */
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', translations[lang].meta.description);

  /* lang toggle button label */
  var btn = document.getElementById('langToggle');
  if (btn) {
    btn.querySelector('.lang-toggle-label').textContent = lang === 'ja' ? 'EN' : 'JA';
    btn.setAttribute('lang', lang === 'ja' ? 'en' : 'ja');
  }

  /* typewriter phrases */
  if (typeof window.updateTypewriterPhrases === 'function') {
    window.updateTypewriterPhrases(translations[lang].typewriter.phrases);
  } else {
    window.i18nPhrases = translations[lang].typewriter.phrases;
  }

  /* count-up re-animation */
  updateCountUpLang(lang);
}

/* ---- initialization ---- */
(function () {
  var stored = localStorage.getItem('lang');
  var lang = stored || 'ja';
  /* Set lang attribute (ja is already set in HTML) */
  document.documentElement.lang = lang;
  if (lang !== 'ja') {
    /* Apply translations after DOM is ready */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { setLang(lang); });
    } else {
      setLang(lang);
    }
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('langToggle');
  if (btn) {
    /* Set initial label */
    var currentLang = document.documentElement.lang || 'ja';
    btn.querySelector('.lang-toggle-label').textContent = currentLang === 'ja' ? 'EN' : 'JA';

    btn.addEventListener('click', function () {
      var current = document.documentElement.lang || 'ja';
      setLang(current === 'ja' ? 'en' : 'ja');
    });
  }
});
