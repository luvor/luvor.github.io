/**
 * i18n.js — Translation strings and DOM hydration.
 * Boot language detection runs inline in <head> (see index.html).
 * This module hydrates data-i18n attributes after DOM is ready.
 */

(function () {
  'use strict';

  var translations = {
    en: {
      // Nav
      'nav.about': 'About',
      'nav.skills': 'Skills',
      'nav.experience': 'Experience',
      'nav.projects': 'Projects',
      'nav.education': 'Education',
      'nav.evidence': 'Evidence',
      'nav.contact': 'Contact',
      'nav.lang-toggle': 'Switch to Russian',

      // Hero
      'hero.badge': 'Available for work',
      'hero.kicker': 'Senior Frontend Engineer / AI Systems Builder / Kazakhstan',
      'hero.subtitle': 'I build high-discipline interfaces and AI-augmented product systems that feel precise, fast, and unmistakably production ready.',
      'hero.cta.work': 'View Work',
      'hero.cta.contact': 'Get in Touch',
      'hero.signal.years.num': '5+',
      'hero.signal.years.label': 'years shipping digital products',
      'hero.signal.projects.num': '30+',
      'hero.signal.projects.label': 'projects delivered across fintech and AI',
      'hero.signal.ai.num': 'AI × UX',
      'hero.signal.ai.label': 'frontend systems with practical automation',

      // Hero panel
      'hero.panel.label': 'Current Focus',
      'hero.panel.title': 'Building the bridge between resilient frontend systems and practical AI leverage.',
      'hero.panel.halyk.eyebrow': 'At Halyk',
      'hero.panel.halyk.text': 'Leading a frontend stream and raising delivery quality across products.',
      'hero.panel.ai.eyebrow': 'With AI',
      'hero.panel.ai.text': 'Using agents for review, documentation, testing, and developer acceleration.',
      'hero.panel.product.eyebrow': 'In Product',
      'hero.panel.product.text': 'Designing interfaces that stay sharp under scale, complexity, and change.',

      // About
      'about.label': 'About Me',
      'about.title.1': 'Building the bridge between',
      'about.title.2': 'AI & great UX',
      'about.p1': 'I am a Senior Frontend Engineer based in Kazakhstan with 5+ years in FinTech and product delivery. My strongest work happens where interface quality, system thinking, and execution discipline have to coexist under real business pressure.',
      'about.p2': 'At Halyk Finservice I lead a frontend stream and introduced AI agents into review, documentation, and testing workflows. The point is not novelty. The point is raising team throughput without lowering engineering standards.',
      'about.p3': 'I focus on building calmer systems: clearer interfaces, cleaner delivery loops, better architecture decisions, and AI that actually removes friction instead of adding noise.',
      'about.dossier.label': 'Operator Snapshot',
      'about.dossier.role.label': 'Current role',
      'about.dossier.role.value': 'Frontend Lead / AI Systems Builder',
      'about.dossier.domain.label': 'Primary domain',
      'about.dossier.domain.value': 'FinTech, internal platforms, delivery systems',
      'about.dossier.edge.label': 'Core edge',
      'about.dossier.edge.value': 'Turning complexity into cleaner execution',
      'about.dossier.style.label': 'Working style',
      'about.dossier.style.value': 'High standards, low noise, production-first decisions',
      'about.note.label': 'How I work',
      'about.note.li1': 'System thinking before feature clutter.',
      'about.note.li2': 'Performance as a product trait, not a polish pass.',
      'about.note.li3': 'AI used for leverage, never for noise.',

      // Skills
      'skills.label': 'Skills & Tools',
      'skills.title': 'Technologies I work with',

      // Experience
      'experience.label': 'Experience',
      'experience.title.1': 'My professional',
      'experience.title.accent': 'journey',
      'experience.cv.title': 'Want the full story?',
      'experience.cv.desc': 'Download my complete CV for a detailed overview of my experience and skills.',
      'experience.cv.btn': 'Download CV',

      // Projects
      'projects.label': 'Projects',
      'projects.title.1': 'Selected',
      'projects.title.accent': 'case studies',

      // CS01
      'cs01.kicker': 'Case Study 01',
      'cs01.title': 'Overlayer AI — Ambient context engine for macOS developers',
      'cs01.summary': 'A native macOS app that continuously captures screen context via Vision OCR, accessibility trees, and clipboard — surfacing contextual hints in a frosted-glass overlay during natural developer pauses. Zero telemetry. Local-first.',
      'cs01.li1': 'Hybrid search: Apple NLEmbedding (vector) + FTS5 (keyword) + reciprocal rank fusion — all on-device.',
      'cs01.li2': 'Complexity-routed LLM dispatch: simple → Haiku, complex → Sonnet, privacy-sensitive → local Apple Foundation Models.',
      'cs01.li3': 'MCP server exposes context to Claude Code and external agents. Swift 5.10 + GRDB SQLite. Apache 2.0.',
      'cs01.link': 'GitHub',
      'cs01.stat1.label': 'Platform',
      'cs01.stat1.value': 'Native macOS 14+',
      'cs01.stat1.desc': 'Swift + Vision framework + NLEmbedding. No Electron, no web shell.',
      'cs01.stat2.label': 'Architecture',
      'cs01.stat2.value': 'Privacy-first, local compute',
      'cs01.stat2.desc': 'All embeddings and search run on-device. LLM routing by privacy sensitivity.',

      // CS02
      'cs02.kicker': 'Case Study 02',
      'cs02.title': 'HalykMarket AI delivery system — Enterprise frontend at bank scale',
      'cs02.summary': "Built a practical AI layer inside the engineering workflow at Halyk Finservice — Kazakhstan's largest bank subsidiary. Automated review support, documentation generation, test drafting, and cleaner delivery rituals.",
      'cs02.li1': 'Inserted AI agents where manual repetition was highest and quality drift was most expensive.',
      'cs02.li2': 'Framed the system as delivery leverage, not demo-ware. Architectural review and final judgment stayed human-led.',
      'cs02.li3': 'Ghost Mode: zero AI attribution in external artifacts (MRs, commits, emails, Jira) — enforced systematically.',
      'cs02.link': 'Context',
      'cs02.stat1.label': 'Focus',
      'cs02.stat1.value': 'Velocity without entropy',
      'cs02.stat1.desc': 'Reduce overhead while raising consistency across the team.',
      'cs02.stat2.label': 'Core stack',
      'cs02.stat2.value': 'Vue 3, TypeScript, LLM agents',
      'cs02.stat2.desc': 'Operational AI applied directly to delivery flow.',

      // CS03
      'cs03.kicker': 'Case Study 03',
      'cs03.title': 'tg-moder — Production RAG moderation system at $2/mo',
      'cs03.summary': 'Production Telegram moderation bot for a 17K-member community. 3-pass hybrid retrieval (pgvector HNSW + tsvector BM25 + ILIKE) with RRF k=60. Deployed on Railway with shadow-before-live discipline.',
      'cs03.li1': '10-stage cost cascade: cache → FAQ → route → RAG → LLM → judge. $2/mo operational cost with ~67% FAQ hit rate.',
      'cs03.li2': 'Confidence gate 0.65, relevance floor 0.15, monthly budget hard cap ($5) checked BEFORE embed call.',
      'cs03.li3': 'Shadow mode first: logged every response before enabling live replies. Replay fixtures + pre-deploy checks.',
      'cs03.link': 'GitHub',
      'cs03.stat1.label': 'Retrieval',
      'cs03.stat1.value': '3-pass hybrid + RRF k=60',
      'cs03.stat1.desc': 'pgvector HNSW · tsvector BM25 · ILIKE. OpenAI text-embedding-3-large (3072d).',
      'cs03.stat2.label': 'Cost',
      'cs03.stat2.value': '$2/mo operational',
      'cs03.stat2.desc': 'Budget hard cap enforced pre-embed. LLM cost cascade, not brute force.',

      // CS04
      'cs04.kicker': 'Case Study 04',
      'cs04.title': 'Shipping under pressure — hackathon wins and App Store delivery',
      'cs04.summary': 'Two hackathon 1st places and sustained cross-platform delivery to App Store and Play Store. Speed of execution without architectural shortcuts.',
      'cs04.li1': 'Savabit Mining hackathon — 1st place: blockchain/mining operations MVP, full product cycle under 48h.',
      'cs04.li2': 'Ioka.kz × Mastercard hackathon — 1st place: payment platform MVP with live transaction flows.',
      'cs04.li3': 'Adamar Solutions: shipped multiple apps to App Store + Play Store using Vue 3 + Nuxt 3 + Capacitor + Ionic + Tauri.',
      'cs04.link': 'LinkedIn',
      'cs04.stat1.label': 'Wins',
      'cs04.stat1.value': '2× hackathon 1st place',
      'cs04.stat1.desc': 'Named events, verifiable on LinkedIn. Product speed without cutting engineering corners.',
      'cs04.stat2.label': 'Platforms',
      'cs04.stat2.value': 'Web · iOS · Android · Desktop',
      'cs04.stat2.desc': 'Sustained cross-platform delivery — not prototypes, shipped to stores.',

      // Education
      'education.label': 'Education',
      'education.title.1': 'Learning never',
      'education.title.accent': 'stops',

      // Evidence
      'evidence.label': 'Evidence',
      'evidence.title.1': 'What this work is really',
      'evidence.title.accent': 'about',
      'evidence.card1.label': 'Delivery',
      'evidence.card1.title': 'I optimize for throughput that still feels deliberate.',
      'evidence.card1.desc': 'Speed matters only when architecture, review quality, and product clarity survive it.',
      'evidence.card2.label': 'AI',
      'evidence.card2.title': 'I use AI as leverage inside the workflow, not as decoration on top of it.',
      'evidence.card2.desc': 'Automation belongs where teams repeat expensive manual work and where consistency matters.',
      'evidence.card3.label': 'Leadership',
      'evidence.card3.title': 'I make systems calmer for the people shipping them.',
      'evidence.card3.desc': 'That means cleaner decisions, clearer interfaces, better decomposition, and less operational chaos.',
      'evidence.card4.label': 'Fit',
      'evidence.card4.title': 'My best environment is ambitious product work with real complexity and real stakes.',
      'evidence.card4.desc': 'FinTech, internal platforms, AI-enabled tooling, and teams that care about execution quality.',

      // Contact
      'contact.label': 'Contact',
      'contact.title.1': "Let's build something",
      'contact.title.accent': 'amazing together',
      'contact.link.email': 'Email →',
      'contact.link.linkedin': 'LinkedIn →',
      'contact.link.github': 'GitHub →',
      'contact.link.versions': 'Versions →',
      'contact.copyright': '© 2026 Islambek Chynybekov',

      // Skip link
      'skip.link': 'Skip to content',

      // PWA
      'pwa.install': 'Install App',
    },

    ru: {
      // Nav
      'nav.about': 'Обо мне',
      'nav.skills': 'Навыки',
      'nav.experience': 'Опыт',
      'nav.projects': 'Проекты',
      'nav.education': 'Образование',
      'nav.evidence': 'Доказательства',
      'nav.contact': 'Контакт',
      'nav.lang-toggle': 'Switch to English',

      // Hero
      'hero.badge': 'Открыт к предложениям',
      'hero.kicker': 'Senior Frontend Engineer / AI Systems Builder / Казахстан',
      'hero.subtitle': 'Строю высокодисциплинированные интерфейсы и AI-продукты — точные, быстрые и готовые к production.',
      'hero.cta.work': 'Смотреть работы',
      'hero.cta.contact': 'Написать',
      'hero.signal.years.num': '5+',
      'hero.signal.years.label': 'лет в production-разработке',
      'hero.signal.projects.num': '30+',
      'hero.signal.projects.label': 'проектов в fintech и AI',
      'hero.signal.ai.num': 'AI × UX',
      'hero.signal.ai.label': 'frontend-системы с реальной автоматизацией',

      // Hero panel
      'hero.panel.label': 'Текущий фокус',
      'hero.panel.title': 'Строю мост между устойчивыми frontend-системами и практическим AI-левериджем.',
      'hero.panel.halyk.eyebrow': 'В Halyk',
      'hero.panel.halyk.text': 'Руковожу frontend-стримом и повышаю качество доставки по всем продуктам.',
      'hero.panel.ai.eyebrow': 'С AI',
      'hero.panel.ai.text': 'Использую агентов для ревью, документации, тестирования и ускорения разработчиков.',
      'hero.panel.product.eyebrow': 'В продукте',
      'hero.panel.product.text': 'Проектирую интерфейсы, которые остаются чёткими под давлением масштаба и изменений.',

      // About
      'about.label': 'Обо мне',
      'about.title.1': 'Строю мост между',
      'about.title.2': 'AI и качественным UX',
      'about.p1': 'Senior Frontend Engineer из Казахстана с 5+ годами в FinTech и продуктовой разработке. Лучшие результаты — там, где качество интерфейса, системное мышление и дисциплина исполнения должны сосуществовать под реальным бизнес-давлением.',
      'about.p2': 'В Halyk Finservice руковожу frontend-стримом и ввёл AI-агентов в процессы ревью, документации и тестирования. Цель — не новизна. Цель — повысить пропускную способность команды без снижения инженерных стандартов.',
      'about.p3': 'Фокус — на более спокойных системах: чище интерфейсы, чище циклы доставки, лучше архитектурные решения, и AI, который убирает трение, а не добавляет шум.',
      'about.dossier.label': 'Оперативный дашборд',
      'about.dossier.role.label': 'Текущая роль',
      'about.dossier.role.value': 'Frontend Lead / AI Systems Builder',
      'about.dossier.domain.label': 'Основная область',
      'about.dossier.domain.value': 'FinTech, внутренние платформы, системы доставки',
      'about.dossier.edge.label': 'Ключевое преимущество',
      'about.dossier.edge.value': 'Превращаю сложность в более чистое исполнение',
      'about.dossier.style.label': 'Стиль работы',
      'about.dossier.style.value': 'Высокие стандарты, минимум шума, production-first решения',
      'about.note.label': 'Как я работаю',
      'about.note.li1': 'Системное мышление раньше, чем feature clutter.',
      'about.note.li2': 'Производительность — свойство продукта, не финальная полировка.',
      'about.note.li3': 'AI используется для левериджа, никогда для шума.',

      // Skills
      'skills.label': 'Навыки и инструменты',
      'skills.title': 'Технологии, с которыми я работаю',

      // Experience
      'experience.label': 'Опыт',
      'experience.title.1': 'Мой профессиональный',
      'experience.title.accent': 'путь',
      'experience.cv.title': 'Хотите полную картину?',
      'experience.cv.desc': 'Скачайте полное CV с детальным описанием опыта и навыков.',
      'experience.cv.btn': 'Скачать CV',

      // Projects
      'projects.label': 'Проекты',
      'projects.title.1': 'Избранные',
      'projects.title.accent': 'кейс-стади',

      // CS01
      'cs01.kicker': 'Кейс 01',
      'cs01.title': 'Overlayer AI — Ambient-контекст движок для macOS-разработчиков',
      'cs01.summary': 'Нативное macOS-приложение, непрерывно захватывающее контекст экрана через Vision OCR, accessibility trees и буфер обмена — показывает контекстные подсказки в полупрозрачном оверлее в паузах разработчика. Нулевая телеметрия. Local-first.',
      'cs01.li1': 'Гибридный поиск: Apple NLEmbedding (вектор) + FTS5 (ключевые слова) + reciprocal rank fusion — всё на устройстве.',
      'cs01.li2': 'LLM-маршрутизация по сложности: простое → Haiku, сложное → Sonnet, конфиденциальное → локальные Apple Foundation Models.',
      'cs01.li3': 'MCP-сервер открывает контекст для Claude Code и внешних агентов. Swift 5.10 + GRDB SQLite. Apache 2.0.',
      'cs01.link': 'GitHub',
      'cs01.stat1.label': 'Платформа',
      'cs01.stat1.value': 'Нативный macOS 14+',
      'cs01.stat1.desc': 'Swift + Vision framework + NLEmbedding. Без Electron, без web-оболочки.',
      'cs01.stat2.label': 'Архитектура',
      'cs01.stat2.value': 'Privacy-first, локальные вычисления',
      'cs01.stat2.desc': 'Все эмбеддинги и поиск — на устройстве. LLM-маршрутизация по чувствительности к приватности.',

      // CS02
      'cs02.kicker': 'Кейс 02',
      'cs02.title': 'HalykMarket AI — AI-система доставки в банковском frontend',
      'cs02.summary': 'Практический AI-слой внутри инженерного воркфлоу Halyk Finservice — крупнейшей банковской дочки Казахстана. Автоматизация ревью, генерация документации, написание тестов и чище циклы доставки.',
      'cs02.li1': 'AI-агенты встроены туда, где ручное повторение максимально и дрейф качества стоит дороже всего.',
      'cs02.li2': 'Система — как leverage для доставки, не как демо-поделка. Архитектурное ревью и финальное суждение — только люди.',
      'cs02.li3': 'Ghost Mode: нулевая AI-атрибуция во внешних артефактах (MR, коммиты, письма, Jira) — применяется системно.',
      'cs02.link': 'Контекст',
      'cs02.stat1.label': 'Фокус',
      'cs02.stat1.value': 'Скорость без энтропии',
      'cs02.stat1.desc': 'Снизить накладные расходы, повысить консистентность в команде.',
      'cs02.stat2.label': 'Стек',
      'cs02.stat2.value': 'Vue 3, TypeScript, LLM-агенты',
      'cs02.stat2.desc': 'Операционный AI встроен прямо в delivery flow.',

      // CS03
      'cs03.kicker': 'Кейс 03',
      'cs03.title': 'tg-moder — Production RAG-система модерации за $2/мес',
      'cs03.summary': 'Production Telegram-бот модерации для community 17K+ участников. 3-pass гибридный поиск (pgvector HNSW + tsvector BM25 + ILIKE) с RRF k=60. Деплой на Railway с shadow-before-live дисциплиной.',
      'cs03.li1': '10-этапный каскад стоимости: cache → FAQ → route → RAG → LLM → judge. $2/мес при ~67% FAQ hit rate.',
      'cs03.li2': 'Confidence gate 0.65, relevance floor 0.15, жёсткий месячный лимит бюджета ($5) — проверяется ДО вызова embed.',
      'cs03.li3': 'Сначала shadow mode: логировал каждый ответ перед включением живых ответов. Replay fixtures + pre-deploy checks.',
      'cs03.link': 'GitHub',
      'cs03.stat1.label': 'Поиск',
      'cs03.stat1.value': '3-pass hybrid + RRF k=60',
      'cs03.stat1.desc': 'pgvector HNSW · tsvector BM25 · ILIKE. OpenAI text-embedding-3-large (3072d).',
      'cs03.stat2.label': 'Стоимость',
      'cs03.stat2.value': '$2/мес operational',
      'cs03.stat2.desc': 'Жёсткий лимит бюджета до embed. Каскад LLM-стоимости, не brute force.',

      // CS04
      'cs04.kicker': 'Кейс 04',
      'cs04.title': 'Доставка под давлением — победы в хакатонах и App Store',
      'cs04.summary': 'Два 1-х места на хакатонах и устойчивая кросс-платформенная доставка в App Store и Play Store. Скорость исполнения без архитектурных компромиссов.',
      'cs04.li1': 'Savabit Mining hackathon — 1-е место: MVP майнинговых операций на блокчейне, полный цикл продукта за 48ч.',
      'cs04.li2': 'Ioka.kz × Mastercard hackathon — 1-е место: платёжная платформа с живыми транзакционными потоками.',
      'cs04.li3': 'Adamar Solutions: шипнул несколько приложений в App Store + Play Store на Vue 3 + Nuxt 3 + Capacitor + Ionic + Tauri.',
      'cs04.link': 'LinkedIn',
      'cs04.stat1.label': 'Победы',
      'cs04.stat1.value': '2× хакатон, 1-е место',
      'cs04.stat1.desc': 'Именные события, верифицируются в LinkedIn. Скорость продукта без компромисса с инженерией.',
      'cs04.stat2.label': 'Платформы',
      'cs04.stat2.value': 'Web · iOS · Android · Desktop',
      'cs04.stat2.desc': 'Устойчивая кросс-платформенная доставка — не прототипы, зашиплено в сторы.',

      // Education
      'education.label': 'Образование',
      'education.title.1': 'Обучение никогда',
      'education.title.accent': 'не останавливается',

      // Evidence
      'evidence.label': 'Доказательства',
      'evidence.title.1': 'О чём эта работа на самом деле',
      'evidence.title.accent': 'говорит',
      'evidence.card1.label': 'Доставка',
      'evidence.card1.title': 'Оптимизирую пропускную способность, которая при этом остаётся осмысленной.',
      'evidence.card1.desc': 'Скорость важна только когда архитектура, качество ревью и ясность продукта её выдерживают.',
      'evidence.card2.label': 'AI',
      'evidence.card2.title': 'Использую AI как леверидж внутри воркфлоу, а не как украшение поверх него.',
      'evidence.card2.desc': 'Автоматизация нужна там, где команды повторяют дорогую ручную работу и где важна консистентность.',
      'evidence.card3.label': 'Лидерство',
      'evidence.card3.title': 'Делаю системы спокойнее для людей, которые в них шипают.',
      'evidence.card3.desc': 'Это означает чище решения, чище интерфейсы, лучше декомпозицию и меньше операционного хаоса.',
      'evidence.card4.label': 'Fit',
      'evidence.card4.title': 'Лучшая среда для меня — амбициозная продуктовая работа с реальной сложностью и реальными ставками.',
      'evidence.card4.desc': 'FinTech, внутренние платформы, AI-tooling и команды, которым важно качество исполнения.',

      // Contact
      'contact.label': 'Контакт',
      'contact.title.1': 'Давайте создадим что-то',
      'contact.title.accent': 'вместе',
      'contact.link.email': 'Email →',
      'contact.link.linkedin': 'LinkedIn →',
      'contact.link.github': 'GitHub →',
      'contact.link.versions': 'Версии →',
      'contact.copyright': '© 2026 Islambek Chynybekov',

      // Skip link
      'skip.link': 'Перейти к содержимому',

      // PWA
      'pwa.install': 'Установить',
    }
  };

  function getLang() {
    return window.__siteLang || 'en';
  }

  function t(key) {
    var lang = getLang();
    var dict = translations[lang] || translations['en'];
    return dict[key] || translations['en'][key] || key;
  }

  function hydrate() {
    var lang = getLang();
    document.documentElement.lang = lang;

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute('data-i18n');
      var val = t(key);
      if (el.getAttribute('data-i18n-attr')) {
        el.setAttribute(el.getAttribute('data-i18n-attr'), val);
      } else {
        el.textContent = val;
      }
    }

    // Update hreflang canonical
    var canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.href = lang === 'ru'
        ? 'https://luvor.github.io/?lang=ru'
        : 'https://luvor.github.io/';
    }

    // Lang toggle button label
    var toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      var targetLang = lang === 'en' ? 'RU' : 'EN';
      toggleBtn.textContent = targetLang;
      toggleBtn.setAttribute('aria-label', t('nav.lang-toggle'));
    }

    // Update meta description for RU
    if (lang === 'ru') {
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', 'Портфолио Islambek Chynybekov — Senior Frontend Engineer и AI Systems Builder. 5+ лет в FinTech. Overlayer AI, tg-moder RAG, HalykMarket AI delivery.');
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', 'Senior Frontend Engineer из Казахстана. 5+ лет в FinTech. AI-системы, нативный macOS, production RAG, лидерство в банковском масштабе.');
      var twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', 'Senior Frontend Engineer из Казахстана. 5+ лет в FinTech. AI-системы, нативный macOS, production RAG, лидерство в банковском масштабе.');
    }
  }

  function switchLang(newLang) {
    window.__siteLang = newLang;
    localStorage.setItem('lang', newLang);
    history.replaceState(null, '', newLang === 'ru' ? '/?lang=ru' : '/');
    hydrate();
  }

  // Wire toggle button after DOM ready
  function init() {
    var toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var current = getLang();
        switchLang(current === 'en' ? 'ru' : 'en');
      });
    }
    hydrate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.__i18n = { t: t, switchLang: switchLang, hydrate: hydrate };
})();
