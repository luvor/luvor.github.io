(function () {
  'use strict';

  const COMMITS_URL = 'https://api.github.com/repos/luvor/luvor.github.io/commits?per_page=100';
  const COMMITS_PAGE_URL = 'https://github.com/luvor/luvor.github.io/commits/main';
  const CACHE_KEY = 'portfolio-versions-cache-v1';
  const CACHE_TTL = 5 * 60 * 1000;

  const loadingState = document.getElementById('versions-loading');
  const errorState = document.getElementById('versions-error');
  const timeline = document.getElementById('versions-timeline');

  function readCache() {
    try {
      const cachedValue = sessionStorage.getItem(CACHE_KEY);
      if (!cachedValue) return null;
      return JSON.parse(cachedValue);
    } catch (error) {
      return null;
    }
  }

  function writeCache(commits) {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          commits: commits,
        })
      );
    } catch (error) {}
  }

  function setLoading(isLoading) {
    if (!loadingState) return;
    loadingState.hidden = !isLoading;
  }

  function showError() {
    setLoading(false);

    if (timeline) {
      timeline.hidden = true;
      timeline.innerHTML = '';
    }

    if (errorState) {
      errorState.hidden = false;
    }
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));
  }

  function buildTimelineEntry(commit, versionNumber) {
    const item = document.createElement('li');
    item.className = 'version-entry';

    const badge = document.createElement('span');
    badge.className = 'version-badge';
    badge.textContent = 'v' + versionNumber;

    const meta = document.createElement('div');
    meta.className = 'version-meta';

    const date = document.createElement('time');
    date.className = 'version-date';
    date.dateTime = commit.date;
    date.textContent = formatDate(commit.date);

    const shaLink = document.createElement('a');
    shaLink.className = 'version-sha';
    shaLink.href = commit.url;
    shaLink.target = '_blank';
    shaLink.rel = 'noopener';
    shaLink.textContent = commit.sha.slice(0, 7);

    meta.append(date, shaLink);

    const title = document.createElement('h3');
    title.className = 'version-message';
    title.textContent = commit.message;

    item.append(badge, meta, title);

    return item;
  }

  function render(commits) {
    if (!timeline) return;

    timeline.innerHTML = '';
    const total = commits.length;

    commits.forEach(function (commit, index) {
      timeline.appendChild(buildTimelineEntry(commit, total - index));
    });

    setLoading(false);

    if (errorState) {
      errorState.hidden = true;
    }

    timeline.hidden = false;
  }

  function normalizeCommits(payload) {
    return payload.map(function (entry) {
      return {
        sha: entry.sha,
        message: (entry.commit && entry.commit.message ? entry.commit.message : '').split('\n')[0],
        date: entry.commit && entry.commit.author ? entry.commit.author.date : '',
        url: entry.html_url || COMMITS_PAGE_URL,
      };
    }).filter(function (commit) {
      return commit.sha && commit.message && commit.date;
    });
  }

  async function fetchCommits() {
    const response = await fetch(COMMITS_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('GitHub request failed with status ' + response.status);
    }

    const payload = await response.json();
    const commits = normalizeCommits(payload);

    if (!commits.length) {
      throw new Error('No commits returned');
    }

    writeCache(commits);
    return commits;
  }

  async function init() {
    setLoading(true);

    const cached = readCache();
    if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_TTL && Array.isArray(cached.commits)) {
      render(cached.commits);
      return;
    }

    try {
      const commits = await fetchCommits();
      render(commits);
    } catch (error) {
      if (cached && Array.isArray(cached.commits) && cached.commits.length) {
        render(cached.commits);
        return;
      }

      showError();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
