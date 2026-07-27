/**
 * Chetan Lifters - Language Detection, Persistence & Navigation Router
 */

(function () {
  // Parse URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const forcedLang = urlParams.get('lang');

  // If ?lang=hi or ?lang=en is explicitly passed, store it
  if (forcedLang === 'hi' || forcedLang === 'en') {
    localStorage.setItem('chetan_lang', forcedLang);
  }

  // Get active stored language preference
  let storedLang = localStorage.getItem('chetan_lang');

  // Check current page path
  const currentPath = window.location.pathname;
  const isHindiPage = currentPath.includes('/hi/') || currentPath.endsWith('/hi');

  // If first visit (no localStorage choice set yet)
  if (!storedLang) {
    const userLangs = navigator.languages || [navigator.language || navigator.userLanguage || 'en'];
    const isHindiBrowser = userLangs.some(l => l && l.toLowerCase().startsWith('hi'));
    storedLang = isHindiBrowser ? 'hi' : 'en';
    localStorage.setItem('chetan_lang', storedLang);
  }

  // Check if redirect should be bypassed (e.g. ?noredirect=1, or direct Google search landing)
  const isGoogleReferrer = document.referrer && (document.referrer.includes('google.') || document.referrer.includes('bing.'));
  const noRedirect = urlParams.has('noredirect') || (isGoogleReferrer && isHindiPage);

  // Auto-Redirect if user's saved preference does not match current page language
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

  /**
   * Calculates the equivalent Hindi or English URL for the current path
   * @param {string} targetLang - 'hi' | 'en'
   * @returns {string} Target path
   */
  function getCounterpartUrl(targetLang) {
    let path = window.location.pathname;
    const isHi = path.includes('/hi/');

    // Get current filename (e.g. services.html, about.html, etc.)
    let filename = path.substring(path.lastIndexOf('/') + 1);
    if (!filename || filename === 'hi') filename = 'index.html';

    if (targetLang === 'hi') {
      if (isHi) return path;
      // Convert English path to Hindi path
      if (path === '/' || path === '' || filename === 'index.html') {
        return '/hi/index.html';
      }
      return '/hi/' + filename;
    } else {
      if (!isHi) return path;
      // Convert Hindi path to English path
      if (filename === 'index.html') {
        return '/index.html';
      }
      return '/' + filename;
    }
  }

  /**
   * Switch language on user toggle click
   * @param {string} lang - 'hi' | 'en'
   */
  window.switchChetanLanguage = function (lang) {
    localStorage.setItem('chetan_lang', lang);
    const target = getCounterpartUrl(lang);
    window.location.href = target + '?noredirect=1';
  };

  // Expose counterpart utility
  window.getCounterpartUrl = getCounterpartUrl;
})();
