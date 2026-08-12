/**
 * Chetan Crane Service - Language Detection, Persistence & Navigation Router
 */

(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const forcedLang = urlParams.get('lang');

  if (forcedLang === 'hi' || forcedLang === 'en') {
    localStorage.setItem('chetan_lang', forcedLang);
  }

  let storedLang = localStorage.getItem('chetan_lang');

  const currentPath = window.location.pathname;
  const isHindiPage = currentPath.indexOf('/hi/') === 0 || currentPath === '/hi';

  if (!storedLang) {
    const userLangs = navigator.languages || [navigator.language || 'en'];
    const isHindiBrowser = userLangs.some(l => l && l.toLowerCase().startsWith('hi'));
    storedLang = isHindiBrowser ? 'hi' : 'en';
    localStorage.setItem('chetan_lang', storedLang);
  }

  const isSearchReferrer = document.referrer && (document.referrer.indexOf('google.') !== -1 || document.referrer.indexOf('bing.') !== -1);
  const noRedirect = urlParams.has('noredirect') || (isSearchReferrer && isHindiPage);

  if (!noRedirect) {
    if (storedLang === 'hi' && !isHindiPage) {
      const target = getCounterpartUrl('hi');
      if (target && target !== currentPath) {
        window.location.replace(target + window.location.search);
        return;
      }
    } else if (storedLang === 'en' && isHindiPage) {
      const target = getCounterpartUrl('en');
      if (target && target !== currentPath) {
        window.location.replace(target + window.location.search);
        return;
      }
    }
  }

  function getCounterpartUrl(targetLang) {
    let path = window.location.pathname;
    const isHi = path.indexOf('/hi/') === 0;
    let filename = path.substring(path.lastIndexOf('/') + 1);
    if (filename === 'index.html') filename = '';

    if (targetLang === 'hi') {
      if (isHi) return path;
      return '/hi/' + filename;
    } else {
      if (!isHi) return path;
      return '/' + filename;
    }
  }

  window.switchChetanLanguage = function (lang) {
    localStorage.setItem('chetan_lang', lang);
    const target = getCounterpartUrl(lang);
    window.location.href = target + '?noredirect=1';
  };

  window.getCounterpartUrl = getCounterpartUrl;
})();
