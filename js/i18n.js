(function () {
  'use strict';
  var translations = {
    en: {
      'discipline.ios': 'iOS app', 'discipline.ui': 'Product UI', 'discipline.brand': 'Brand and print', 'discipline.motion': 'Motion', 'discipline.landing': 'Landing', 'discipline.ai': 'AI imagery',
      'meta.title': 'Islambek Chynybekov — Product designer and developer',
      'nav.work': 'Work', 'nav.about': 'About', 'nav.contact': 'Contact', 'nav.lang-toggle': 'Switch language',
      'skip.link': 'Skip to content', 'proof.label': 'Selected proof', 'hero.kicker': 'Product designer and developer',
      'hero.claim.1': 'One designer.', 'hero.claim.2': 'Six disciplines.', 'hero.claim.3': 'From idea to working product.',
      'hero.subtitle': 'Digital products, from first screen to release.', 'hero.cta.work': 'View work', 'hero.cta.contact': 'Get in touch',
      'hero.caption': 'Tripmaxx, App Store, live', 'hero.fact.store.value': 'App Store', 'hero.fact.store': 'Tripmaxx live', 'hero.fact.cases': 'NAQYL entries, works offline', 'hero.fact.languages': 'TACT mobile Lighthouse scores',
      'range.title': 'Selected work', 'case.link': 'Case study', 'range.motion.play': 'Play preview', 'range.motion.pause': 'Pause preview',
      'case.tripmaxx.status': 'Live', 'case.netmatch.status': 'Demo', 'case.naqyl.status': 'In preparation', 'case.tact.status': 'Concept', 'case.yasnoten.status': 'Live', 'case.ozger.status': 'Live', 'case.motion-teaser.status': 'Concept', 'case.redteu.status': 'Live', 'case.beni.status': 'Live',
      'case.tripmaxx.live': 'App Store', 'case.ozger.live': 'Open ÖZGER', 'case.redteu.live': 'Open REDTEU', 'case.beni.live': 'Open BENI', 'case.ai.caption': 'AI visual study', 'contact.versions': 'Versions', 'pwa.install': 'Install app',
      'case.tripmaxx.kind': 'Solo design and iOS development', 'case.tripmaxx.summary': 'A travel film made from photos and routes.', 'case.tripmaxx.proof': 'Available on the App Store', 'case.tripmaxx.alt': 'Tripmaxx travel film product',
      'case.netmatch.kind': 'Product design, client and server development', 'case.netmatch.summary': 'Job search by swipe, with take-home pay shown.', 'case.netmatch.proof': 'Telegram Mini App and Postgres live demo', 'case.netmatch.alt': 'NetMatch product interface',
      'case.naqyl.kind': 'Personal product, prepared for release', 'case.naqyl.proof': 'SwiftUI, 5,883 entries, works offline.', 'case.naqyl.alt': 'NAQYL proverb app',
      'case.tact.kind': 'Product concept and landing design', 'case.tact.proof': 'Lighthouse 100, 100, 96, 100', 'case.tact.score.performance': 'Performance', 'case.tact.score.accessibility': 'Accessibility', 'case.tact.score.best': 'Best practices', 'case.tact.score.seo': 'SEO', 'case.tact.alt': 'TACT camera landing page',
      'case.yasnoten.kind': 'Product design and web development', 'case.yasnoten.proof': 'React, TypeScript, Firebase live build', 'case.yasnoten.alt': 'Yasnoten live product', 'case.yasnoten.live': 'Open Yasnoten live',
      'case.ozger.kind': 'Engineering in a team launch', 'case.ozger.proof': 'Live Russian and Kazakh site', 'case.ozger.alt': 'ÖZGER identity and print',
      'case.motion-teaser.kind': 'Concept and motion design', 'case.motion-teaser.proof': 'A 20-second typography film, rendered at 1080×1920 and 30 fps.', 'case.motion-teaser.alt': 'Typography film frame',
      'case.redteu.kind': 'Product and service website with my partner', 'case.redteu.proof': 'Bookings, pricing and owner summaries', 'case.redteu.alt': 'REDTEU service website',
      'case.beni.kind': 'Studio website with my partner', 'case.beni.proof': 'Studio site with services and process', 'case.beni.alt': 'BENI digital studio website',
      'about.portrait.alt': 'Portrait of Islambek Chynybekov', 'about.title.1': 'About',
      'about.p1': 'Based in Astana, I lead frontend delivery and work across product design and engineering.',
      'about.p2': 'Tripmaxx is my personal App Store release; BENI, REDTEU and ÖZGER are team efforts. I work across consumer products and operational services.',
      'experience.label': 'Experience', 'exp02.date': 'Jul 2023 — Dec 2023', 'exp02.role': 'Frontend Developer', 'exp01.date': 'Jan 2024 — Present', 'exp01.role': 'Frontend Team Lead',
      'exp03.date': 'Aug 2022 — Jul 2023', 'exp03.role': 'Software Developer', 'exp04.date': 'Feb 2022 — Jun 2022', 'exp04.role': 'Full-stack Developer',
      'skills.label': 'Works across six disciplines', 'skills.discipline.ui': 'Product UI', 'skills.discipline.ios': 'iOS', 'skills.discipline.landing': 'Web', 'skills.discipline.brand': 'Brand and print', 'skills.discipline.motion': 'Motion', 'skills.discipline.ai': 'AI visuals',
      'contact.title.1': 'Let’s work together', 'contact.link.email': 'Email me'
    },
    ru: {
      'discipline.ios': 'iOS-приложение', 'discipline.ui': 'Продуктовый UI', 'discipline.brand': 'Бренд и печать', 'discipline.motion': 'Анимация', 'discipline.landing': 'Лендинг', 'discipline.ai': 'ИИ-изображения',
      'meta.title': 'Исламбек Чыныбеков — Дизайнер и разработчик продуктов',
      'nav.work': 'Работы', 'nav.about': 'Обо мне', 'nav.contact': 'Контакты', 'nav.lang-toggle': 'Переключить язык',
      'skip.link': 'Перейти к содержимому', 'proof.label': 'Факты о проектах', 'hero.kicker': 'Дизайнер и разработчик продуктов',
      'hero.claim.1': 'Один дизайнер.', 'hero.claim.2': 'Шесть дисциплин.', 'hero.claim.3': 'От идеи до продукта.',
      'hero.subtitle': 'Цифровые продукты: от первого экрана до выпуска.', 'hero.cta.work': 'Смотреть работы', 'hero.cta.contact': 'Связаться',
      'hero.caption': 'Tripmaxx, App Store, доступен', 'hero.fact.store.value': 'App Store', 'hero.fact.store': 'Tripmaxx доступен', 'hero.fact.cases': 'Записи NAQYL, доступны офлайн', 'hero.fact.languages': 'Оценки Lighthouse сайта TACT на мобильном',
      'range.title': 'Избранные работы', 'case.link': 'Кейс', 'range.motion.play': 'Включить превью', 'range.motion.pause': 'Пауза превью',
      'case.tripmaxx.status': 'Работает', 'case.netmatch.status': 'Демо', 'case.naqyl.status': 'В подготовке', 'case.tact.status': 'Концепт', 'case.yasnoten.status': 'Работает', 'case.ozger.status': 'Работает', 'case.motion-teaser.status': 'Концепт', 'case.redteu.status': 'Работает', 'case.beni.status': 'Работает',
      'case.tripmaxx.live': 'В App Store', 'case.ozger.live': 'Открыть ÖZGER', 'case.redteu.live': 'Открыть REDTEU', 'case.beni.live': 'Открыть BENI', 'case.ai.caption': 'Исследование ИИ-визуала', 'contact.versions': 'История версий', 'pwa.install': 'Установить приложение',
      'case.tripmaxx.kind': 'Самостоятельный дизайн и разработка для iOS', 'case.tripmaxx.summary': 'Фильм о поездке из фотографий и маршрута.', 'case.tripmaxx.proof': 'Доступен в App Store', 'case.tripmaxx.alt': 'Продукт Tripmaxx для создания фильмов о поездках',
      'case.netmatch.kind': 'Продуктовый дизайн, клиентская и серверная разработка', 'case.netmatch.summary': 'Поиск вакансий свайпами с зарплатой на руки.', 'case.netmatch.proof': 'Демо Telegram Mini App и Postgres', 'case.netmatch.alt': 'Интерфейс NetMatch',
      'case.naqyl.kind': 'Личный продукт, готовится к выпуску', 'case.naqyl.proof': 'SwiftUI, 5 883 записи, работает офлайн.', 'case.naqyl.alt': 'Приложение пословиц NAQYL',
      'case.tact.kind': 'Концепт продукта и дизайн лендинга', 'case.tact.proof': 'Lighthouse 100, 100, 96, 100', 'case.tact.score.performance': 'Производительность', 'case.tact.score.accessibility': 'Доступность', 'case.tact.score.best': 'Лучшие практики', 'case.tact.score.seo': 'SEO', 'case.tact.alt': 'Лендинг камеры TACT',
      'case.yasnoten.kind': 'Продуктовый дизайн и веб-разработка', 'case.yasnoten.proof': 'React, TypeScript, Firebase, рабочая версия', 'case.yasnoten.alt': 'Рабочая версия Yasnoten', 'case.yasnoten.live': 'Открыть Yasnoten',
      'case.ozger.kind': 'Инженерная работа в командном запуске', 'case.ozger.proof': 'Сайт на русском и казахском', 'case.ozger.alt': 'Айдентика и печатные материалы ÖZGER',
      'case.motion-teaser.kind': 'Концепция и анимация', 'case.motion-teaser.proof': 'Типографический ролик на 20 секунд, 1080×1920 и 30 fps.', 'case.motion-teaser.alt': 'Кадр типографического ролика',
      'case.redteu.kind': 'Сайт продукта и услуг с партнёром', 'case.redteu.proof': 'Записи, цены и сводки для владельцев', 'case.redteu.alt': 'Сайт REDTEU',
      'case.beni.kind': 'Сайт студии с партнёром', 'case.beni.proof': 'Сайт студии: услуги и процесс работы', 'case.beni.alt': 'Сайт цифровой студии BENI',
      'about.portrait.alt': 'Портрет Исламбека Чыныбекова', 'about.title.1': 'Обо мне',
      'about.p1': 'Я живу в Астане, руковожу frontend-разработкой и совмещаю продуктовый дизайн с инженерной работой.',
      'about.p2': 'Tripmaxx — мой личный продукт в App Store; BENI, REDTEU и ÖZGER — командные проекты. Работаю с потребительскими продуктами и операционными сервисами.',
      'experience.label': 'Опыт', 'exp02.date': 'Июл 2023 — Дек 2023', 'exp02.role': 'Frontend-разработчик', 'exp01.date': 'Янв 2024 — настоящее время', 'exp01.role': 'Руководитель frontend-команды',
      'exp03.date': 'Авг 2022 — Июл 2023', 'exp03.role': 'Разработчик ПО', 'exp04.date': 'Фев 2022 — Июн 2022', 'exp04.role': 'Full-stack разработчик',
      'skills.label': 'Шесть направлений работы', 'skills.discipline.ui': 'Продуктовый интерфейс', 'skills.discipline.ios': 'iOS', 'skills.discipline.landing': 'Веб', 'skills.discipline.brand': 'Бренд и печать', 'skills.discipline.motion': 'Анимация', 'skills.discipline.ai': 'ИИ-визуалы',
      'contact.title.1': 'Обсудим проект', 'contact.link.email': 'Написать'
    }
  };
  function getLang() {
    return window.__siteLang || 'en';
  }

  function t(key) {
    var dictionary = translations[getLang()] || translations.en;
    return dictionary[key] || translations.en[key] || key;
  }

  function hydrate() {
    var lang = getLang();
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      var value = t(element.getAttribute('data-i18n'));
      var attribute = element.getAttribute('data-i18n-attr');
      if (attribute) element.setAttribute(attribute, value);
      else element.textContent = value;
    });

    document.querySelectorAll('[data-case-slug]').forEach(function (link) {
      var base = lang === 'ru' ? 'https://chynybekov.com/projects' : 'https://chynybekov.com/en/projects';
      link.href = base + '/' + link.getAttribute('data-case-slug');
      link.rel = 'noopener';
    });

    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = lang === 'ru' ? 'https://luvor.github.io/?lang=ru' : 'https://luvor.github.io/';

    var toggleButton = document.getElementById('lang-toggle');
    if (toggleButton) {
      toggleButton.textContent = lang === 'en' ? 'RU' : 'EN';
      toggleButton.setAttribute('aria-label', t('nav.lang-toggle'));
    }

    document.title = t('meta.title');
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach(function (meta) {
      meta.content = t('meta.title');
    });

    var description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = lang === 'ru'
        ? 'Портфолио Исламбека Чыныбекова: дизайн и разработка цифровых продуктов от интерфейса до работающего результата.'
        : 'Portfolio of Islambek Chynybekov: design and development from interface to working product.';
    }

    document.dispatchEvent(new Event('languagechange'));
    var menuButton = document.getElementById('nav-toggle');
    if (menuButton) menuButton.setAttribute('aria-label', lang === 'ru' ? 'Переключить меню' : 'Toggle menu');
  }

  function switchLang(lang) {
    window.__siteLang = lang;
    localStorage.setItem('lang', lang);
    history.replaceState(null, '', lang === 'ru' ? '/?lang=ru' : '/');
    hydrate();
  }

  function init() {
    var toggleButton = document.getElementById('lang-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', function () {
        switchLang(getLang() === 'en' ? 'ru' : 'en');
      });
    }
    hydrate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.__i18n={t:t,switchLang:switchLang,hydrate:hydrate};
})();
