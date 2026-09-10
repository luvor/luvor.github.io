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
      'hero.badge': 'Open to collaboration',
      'hero.kicker': 'Frontend Team Lead / Product Builder / Astana',
      'hero.subtitle': 'I take products from first user conversations to release, then test how they reach people.',
      'hero.cta.work': 'View Work',
      'hero.cta.contact': 'Get in Touch',
      'hero.signal.years.num': '5+',
      'hero.signal.years.label': 'years shipping digital products',
      'hero.signal.projects.num': 'App Store',
      'hero.signal.projects.label': 'personally shipped Tripmaxx',
      'hero.signal.ai.num': 'Build → learn',
      'hero.signal.ai.label': 'production delivery and honest experiments',

      // Hero panel
      'hero.panel.label': 'Current Focus',
      'hero.panel.title': 'Releasing apps, talking to users, and testing distribution.',
      'hero.panel.halyk.eyebrow': 'In engineering',
      'hero.panel.halyk.text': 'Leading a frontend team and helping products reach release.',
      'hero.panel.ai.eyebrow': 'As a founder',
      'hero.panel.ai.text': 'Co-building BENI and REDTEU with a partner.',
      'hero.panel.product.eyebrow': 'In Product',
      'hero.panel.product.text': 'Talking to users and testing distribution after release.',

      // About
      'about.label': 'About Me',
      'about.title.1': 'From product idea to',
      'about.title.2': 'a real launch',
      'about.p1': 'I am a Frontend Team Lead and hands-on product builder based in Astana, with 5+ years of product engineering experience. I combine product judgment with the engineering work required to ship.',
      'about.p2': 'Tripmaxx is my personally shipped App Store product. BENI, REDTEU, and ÖZGER are team efforts across product packaging, production delivery, and commercial testing.',
      'about.p3': 'I keep a clear line between what is working, what has launched, and where repeatable distribution is still being discovered.',
      'about.dossier.label': 'Operator Snapshot',
      'about.dossier.role.label': 'Current role',
      'about.dossier.role.value': 'Frontend Team Lead / Product Builder',
      'about.dossier.domain.label': 'Primary domain',
      'about.dossier.domain.value': 'Consumer products and business operations',
      'about.dossier.edge.label': 'Core edge',
      'about.dossier.edge.value': 'Moving from idea to a real launch',
      'about.dossier.style.label': 'Working style',
      'about.dossier.style.value': 'Hands-on, evidence-led, production-minded',
      'about.note.label': 'How I work',
      'about.note.li1': 'Narrow the idea before building.',
      'about.note.li2': 'Own the path through release.',
      'about.note.li3': 'Call experiments experiments until results are proven.',

      // Skills
      'skills.label': 'Skills & Tools',
      'skills.title': 'Technologies I work with',

      // Experience
      'experience.label': 'Experience',
      'experience.title.1': 'My professional',
      'experience.title.accent': 'journey',
      'exp01.date': 'Jan 2024 — Present',
      'exp01.role': 'Team Lead Frontend',
      'exp01.company': 'Halyk Finservice · Astana, Kazakhstan',
      'exp01.desc': 'Leading a frontend team, coordinating delivery, mentoring engineers, and reviewing technical decisions.',
      'exp02.date': 'Jul 2023 — Dec 2023',
      'exp02.role': 'Frontend Developer',
      'exp02.company': 'Halyk Finservice · Astana, Kazakhstan',
      'exp02.desc': 'Built and maintained frontend product interfaces as part of an engineering team.',
      'exp03.date': 'Aug 2022 — Jul 2023',
      'exp03.role': 'Software Developer',
      'exp03.company': 'Kaspi.kz',
      'exp03.desc': 'Developed frontend software as part of a product engineering team.',
      'exp04.date': 'Feb 2022 — Jun 2022',
      'exp04.role': 'Full-stack Developer',
      'exp04.company': 'Air Astana · Almaty, Kazakhstan',
      'exp04.desc': 'Worked as a full-stack developer on product delivery with a cross-functional team.',
      'exp05.date': 'Other product work',
      'exp05.role': 'Frontend product delivery',
      'exp05.company': 'Projects under NDA',
      'exp05.desc': 'Developed a software shell for computer clubs and owned the frontend of an operational app and dashboard.',
      'exp06.date': 'Jan 2019 — Feb 2020',
      'exp06.role': 'Support & Video Creator',
      'exp06.company': 'Morrison · Almaty, Kazakhstan',
      'exp06.desc': 'Created JavaScript, web development, and React tutorials and taught structured lessons for student groups.',

      // Projects
      'projects.label': 'Projects',
      'projects.title.1': 'Selected',
      'projects.title.accent': 'case studies',

      // CS01
      'cs01.kicker': 'Case Study 01',
      'cs01.title': 'Tripmaxx — Personally shipped travel recap app',
      'cs01.summary': 'I created and shipped an on-device iOS app that turns trip photos into a video recap with a route. It is live on the App Store and continues to receive product updates.',
      'cs01.li1': 'Designed, built, and released the app on the App Store.',
      'cs01.li2': 'Processes photos on-device to create a travel story and route.',
      'cs01.li3': 'Testing ways to reach new users after release.',
      'cs01.link': 'App Store',
      'cs01.stat1.label': 'Platform',
      'cs01.stat1.value': 'Live on the App Store',
      'cs01.stat1.desc': 'Apple lists Islambek Chynybekov as developer and seller.',
      'cs01.stat2.label': 'Role',
      'cs01.stat2.value': 'Creator',
      'cs01.stat2.desc': 'Product, engineering, release, and continued updates.',

      // CS02
      'cs02.kicker': 'Case Study 02',
      'cs02.title': 'BENI — Shared venture and delivery platform',
      'cs02.summary': 'Together with a partner, I am building BENI as a shared platform for our own product launches and scoped delivery work.',
      'cs02.li1': 'Combines product research, design, engineering, and launch work.',
      'cs02.li2': 'The live studio and portfolio present our shared work.',
      'cs02.li3': 'Built together with a partner across product and delivery.',
      'cs02.link': 'Visit BENI',
      'cs02.stat1.label': 'Stage',
      'cs02.stat1.value': 'Live venture shell',
      'cs02.stat1.desc': 'A public home for shared launches and delivery.',
      'cs02.stat2.label': 'Team',
      'cs02.stat2.value': 'Built with a partner',
      'cs02.stat2.desc': 'Shared product and delivery work.',

      // CS03
      'cs03.kicker': 'Case Study 03',
      'cs03.title': 'REDTEU — Productized operations for service businesses',
      'cs03.summary': 'Together with a partner, I am shaping operational problems into a clear digital offer for service businesses and testing where demand exists.',
      'cs03.li1': 'Published a live offer for service businesses.',
      'cs03.li2': 'Structured services and pricing into a clear product catalog.',
      'cs03.li3': 'Prepared campaign assets and measurement for demand tests.',
      'cs03.link': 'Visit REDTEU',
      'cs03.stat1.label': 'Stage',
      'cs03.stat1.value': 'Live offer',
      'cs03.stat1.desc': 'Productized services with pricing and acquisition assets.',
      'cs03.stat2.label': 'Current work',
      'cs03.stat2.value': 'Testing demand',
      'cs03.stat2.desc': 'Campaign assets and measurement support the next channel tests.',

      // CS04
      'cs04.kicker': 'Case Study 04',
      'cs04.title': 'ÖZGER — Team production delivery for a real business',
      'cs04.summary': 'In a team, I helped bring a bilingual digital service and its operational workflows into production for a real business.',
      'cs04.li1': 'Delivered a public bilingual service surface.',
      'cs04.li2': 'Supported practical operator and customer workflows.',
      'cs04.li3': 'Built workflows for day-to-day operations.',
      'cs04.link': 'Visit ÖZGER',
      'cs04.stat1.label': 'Stage',
      'cs04.stat1.value': 'Production service',
      'cs04.stat1.desc': 'Public website and operational workflows are live.',
      'cs04.stat2.label': 'Team',
      'cs04.stat2.value': 'Team delivery',
      'cs04.stat2.desc': 'Built in a team across the public service and its operational workflows.',

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
      'evidence.card2.label': 'Ownership',
      'evidence.card2.title': 'Tripmaxx proves I can own the path through a public release.',
      'evidence.card2.desc': 'The product is live on the App Store and continues to receive updates.',
      'evidence.card3.label': 'Leadership',
      'evidence.card3.title': 'I make systems calmer for the people shipping them.',
      'evidence.card3.desc': 'That means cleaner decisions, clearer interfaces, better decomposition, and less operational chaos.',
      'evidence.card4.label': 'Fit',
      'evidence.card4.title': 'My best environment is ambitious product work with real complexity and real stakes.',
      'evidence.card4.desc': 'Consumer products, operational services, and teams that care about execution quality.',

      // Contact
      'contact.label': 'Contact',
      'contact.title.1': "Let's build something",
      'contact.title.accent': 'amazing together',
      'contact.link.email': 'Email →',
      'contact.link.site': 'Personal site →',
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
      'hero.badge': 'Открыт к сотрудничеству',
      'hero.kicker': 'Frontend Team Lead / Product Builder / Астана',
      'hero.subtitle': 'Провожу продукты от первых разговоров с пользователями до релиза, а затем проверяю, как они находят аудиторию.',
      'hero.cta.work': 'Смотреть работы',
      'hero.cta.contact': 'Написать',
      'hero.signal.years.num': '5+',
      'hero.signal.years.label': 'лет в production-разработке',
      'hero.signal.projects.num': 'App Store',
      'hero.signal.projects.label': 'лично запустил Tripmaxx',
      'hero.signal.ai.num': 'Build → learn',
      'hero.signal.ai.label': 'production delivery и честные эксперименты',

      // Hero panel
      'hero.panel.label': 'Текущий фокус',
      'hero.panel.title': 'Выпускаю приложения, разговариваю с пользователями и тестирую distribution.',
      'hero.panel.halyk.eyebrow': 'В инженерии',
      'hero.panel.halyk.text': 'Руковожу frontend-командой и помогаю продуктам доходить до релиза.',
      'hero.panel.ai.eyebrow': 'Как founder',
      'hero.panel.ai.text': 'Вместе с партнёром развиваю BENI и REDTEU.',
      'hero.panel.product.eyebrow': 'В продукте',
      'hero.panel.product.text': 'После релиза разговариваю с пользователями и тестирую distribution.',

      // About
      'about.label': 'Обо мне',
      'about.title.1': 'От продуктовой идеи до',
      'about.title.2': 'реального запуска',
      'about.p1': 'Я Frontend Team Lead и hands-on product builder из Астаны с 5+ годами продуктовой разработки. Соединяю продуктовое мышление с инженерной работой, необходимой для запуска.',
      'about.p2': 'Tripmaxx — мой лично запущенный продукт в App Store. BENI, REDTEU и ÖZGER — командная работа по упаковке продукта, production delivery и коммерческой проверке.',
      'about.p3': 'Чётко разделяю то, что уже работает, то, что только запущено, и то, где repeatable distribution ещё предстоит найти.',
      'about.dossier.label': 'Оперативный дашборд',
      'about.dossier.role.label': 'Текущая роль',
      'about.dossier.role.value': 'Frontend Team Lead / Product Builder',
      'about.dossier.domain.label': 'Основная область',
      'about.dossier.domain.value': 'Consumer-продукты и операционные процессы',
      'about.dossier.edge.label': 'Ключевое преимущество',
      'about.dossier.edge.value': 'Довожу идею до реального запуска',
      'about.dossier.style.label': 'Стиль работы',
      'about.dossier.style.value': 'Hands-on, evidence-led, production-minded',
      'about.note.label': 'Как я работаю',
      'about.note.li1': 'Сужаю идею до начала разработки.',
      'about.note.li2': 'Лично прохожу путь до релиза.',
      'about.note.li3': 'Называю эксперименты экспериментами, пока нет результата.',

      // Skills
      'skills.label': 'Навыки и инструменты',
      'skills.title': 'Технологии, с которыми я работаю',

      // Experience
      'experience.label': 'Опыт',
      'experience.title.1': 'Мой профессиональный',
      'experience.title.accent': 'путь',
      'exp01.date': 'Янв 2024 — настоящее время',
      'exp01.role': 'Team Lead Frontend',
      'exp01.company': 'Halyk Finservice · Астана, Казахстан',
      'exp01.desc': 'Руковожу frontend-командой, координирую delivery, менторю инженеров и проверяю технические решения.',
      'exp02.date': 'Июл 2023 — Дек 2023',
      'exp02.role': 'Frontend Developer',
      'exp02.company': 'Halyk Finservice · Астана, Казахстан',
      'exp02.desc': 'Разрабатывал и поддерживал frontend-интерфейсы продукта в составе инженерной команды.',
      'exp03.date': 'Авг 2022 — Июл 2023',
      'exp03.role': 'Software Developer',
      'exp03.company': 'Kaspi.kz',
      'exp03.desc': 'Разрабатывал frontend в составе продуктовой инженерной команды.',
      'exp04.date': 'Фев 2022 — Июн 2022',
      'exp04.role': 'Full-stack Developer',
      'exp04.company': 'Air Astana · Алматы, Казахстан',
      'exp04.desc': 'Работал full-stack разработчиком над delivery продукта в кросс-функциональной команде.',
      'exp05.date': 'Другие продуктовые проекты',
      'exp05.role': 'Frontend product delivery',
      'exp05.company': 'Проекты под NDA',
      'exp05.desc': 'Разрабатывал оболочку ПО для компьютерных клубов и отвечал за frontend операционного приложения и дашборда.',
      'exp06.date': 'Янв 2019 — Фев 2020',
      'exp06.role': 'Support & Video Creator',
      'exp06.company': 'Morrison · Алматы, Казахстан',
      'exp06.desc': 'Создавал обучающие материалы по JavaScript, веб-разработке и React и проводил структурированные занятия для групп студентов.',

      // Projects
      'projects.label': 'Проекты',
      'projects.title.1': 'Избранные',
      'projects.title.accent': 'кейс-стади',

      // CS01
      'cs01.kicker': 'Кейс 01',
      'cs01.title': 'Tripmaxx — лично запущенное приложение о путешествиях',
      'cs01.summary': 'Я создал и выпустил on-device iOS-приложение, которое превращает фотографии поездки в видео с маршрутом. Продукт доступен в App Store и продолжает получать обновления.',
      'cs01.li1': 'Спроектировал, разработал и выпустил приложение в App Store.',
      'cs01.li2': 'Обрабатывает фотографии на устройстве и собирает историю поездки с маршрутом.',
      'cs01.li3': 'После релиза тестирую способы находить новых пользователей.',
      'cs01.link': 'App Store',
      'cs01.stat1.label': 'Платформа',
      'cs01.stat1.value': 'Live в App Store',
      'cs01.stat1.desc': 'Apple указывает Islambek Chynybekov как разработчика и продавца.',
      'cs01.stat2.label': 'Роль',
      'cs01.stat2.value': 'Создатель',
      'cs01.stat2.desc': 'Продукт, разработка, релиз и последующие обновления.',

      // CS02
      'cs02.kicker': 'Кейс 02',
      'cs02.title': 'BENI — совместная площадка запусков и delivery',
      'cs02.summary': 'Вместе с партнёром строю BENI как общую площадку для собственных продуктовых запусков и scoped delivery.',
      'cs02.li1': 'Соединяем product research, дизайн, разработку и запуск.',
      'cs02.li2': 'Живой сайт студии и портфель показывают нашу совместную работу.',
      'cs02.li3': 'Вместе с партнёром работаем над продуктом и delivery.',
      'cs02.link': 'Открыть BENI',
      'cs02.stat1.label': 'Стадия',
      'cs02.stat1.value': 'Живая venture-площадка',
      'cs02.stat1.desc': 'Публичный дом для совместных запусков и delivery.',
      'cs02.stat2.label': 'Команда',
      'cs02.stat2.value': 'Строим с партнёром',
      'cs02.stat2.desc': 'Совместная продуктовая и delivery-работа.',

      // CS03
      'cs03.kicker': 'Кейс 03',
      'cs03.title': 'REDTEU — продуктовый контур операций сервисного бизнеса',
      'cs03.summary': 'Вместе с партнёром превращаю операционные проблемы сервисного бизнеса в понятное цифровое предложение и проверяю, где есть спрос.',
      'cs03.li1': 'Опубликовали живое предложение для сервисного бизнеса.',
      'cs03.li2': 'Собрали услуги и цены в понятный продуктовый каталог.',
      'cs03.li3': 'Подготовили материалы кампаний и измерение для demand tests.',
      'cs03.link': 'Открыть REDTEU',
      'cs03.stat1.label': 'Стадия',
      'cs03.stat1.value': 'Живое предложение',
      'cs03.stat1.desc': 'Продуктовые услуги, цены и acquisition-материалы.',
      'cs03.stat2.label': 'Текущая работа',
      'cs03.stat2.value': 'Проверка спроса',
      'cs03.stat2.desc': 'Материалы кампаний и измерение поддерживают следующие тесты каналов.',

      // CS04
      'cs04.kicker': 'Кейс 04',
      'cs04.title': 'ÖZGER — командный production delivery для реального бизнеса',
      'cs04.summary': 'В команде помог довести двуязычный цифровой сервис и его операционные сценарии до production для реального бизнеса.',
      'cs04.li1': 'Доставили публичный двуязычный сервис.',
      'cs04.li2': 'Поддержали практические сценарии операторов и клиентов.',
      'cs04.li3': 'Собрали сценарии для ежедневной операционной работы.',
      'cs04.link': 'Открыть ÖZGER',
      'cs04.stat1.label': 'Стадия',
      'cs04.stat1.value': 'Production-сервис',
      'cs04.stat1.desc': 'Публичный сайт и операционные сценарии работают.',
      'cs04.stat2.label': 'Команда',
      'cs04.stat2.value': 'Командный delivery',
      'cs04.stat2.desc': 'Работали командой над публичным сервисом и его операционными сценариями.',

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
      'evidence.card2.label': 'Авторство',
      'evidence.card2.title': 'Tripmaxx доказывает, что я могу лично пройти путь до публичного релиза.',
      'evidence.card2.desc': 'Продукт доступен в App Store и продолжает получать обновления.',
      'evidence.card3.label': 'Лидерство',
      'evidence.card3.title': 'Делаю системы спокойнее для людей, которые в них шипают.',
      'evidence.card3.desc': 'Это означает чище решения, чище интерфейсы, лучше декомпозицию и меньше операционного хаоса.',
      'evidence.card4.label': 'Fit',
      'evidence.card4.title': 'Лучшая среда для меня — амбициозная продуктовая работа с реальной сложностью и реальными ставками.',
      'evidence.card4.desc': 'Consumer-продукты, операционные сервисы и команды, которым важно качество исполнения.',

      // Contact
      'contact.label': 'Контакт',
      'contact.title.1': 'Давайте создадим что-то',
      'contact.title.accent': 'вместе',
      'contact.link.email': 'Email →',
      'contact.link.site': 'Личный сайт →',
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
      if (metaDesc) metaDesc.setAttribute('content', 'Портфолио Islambek Chynybekov — Frontend Team Lead и hands-on product builder. Создатель Tripmaxx, участник BENI и REDTEU.');
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', 'Frontend Team Lead и hands-on product builder из Астаны. Запускаю продукты, production-сервисы и честные demand tests.');
      var twDesc = document.querySelector('meta[name="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', 'Frontend Team Lead и hands-on product builder из Астаны. Создатель Tripmaxx, участник BENI и REDTEU.');
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
