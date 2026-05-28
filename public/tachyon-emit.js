/**
 * Tachyon Emit -- Lightweight page view analytics for 1digit.co.uk
 *
 * Sends PageLoaded events to a Tachyon public endpoint on every page view,
 * including SPA-style navigations (Astro ViewTransitions, History API).
 *
 * Configuration is baked into the CONFIG constant below.
 * No external dependencies. Fire-and-forget. Never blocks rendering.
 *
 * @version 1.0.0
 * @author 1Digit Platform Engineering
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Dev guard — never emit from localhost or LAN (prevents dev pollution in prod Tachyon)
  // ---------------------------------------------------------------------------

  var host = window.location.hostname;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host.endsWith('.local') ||
    /^192\.168\./.test(host) ||
    /^10\./.test(host)
  ) {
    return;
  }

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

  var CONFIG = {
    endpoint:          'https://tachyon-dev.seillen.com/tachyon/PageLoaded',
    pipeline:          'Website',
    source:            'Vivid',
    brand:             '1Digit',
    module:            '1Digit Tachyon',
    service:           'web',
    locale:            'en_GB',
    version:           2,
    sc:                'public',
    visitorCookieName: '_tch_vid',
    sessionStorageKey: '_tch_sid',
    cookieDays:        365,
  };

  // ---------------------------------------------------------------------------
  // Visitor identity (persistent anonymous UUID in a first-party cookie)
  // ---------------------------------------------------------------------------

  function generateId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      name +
      '=' +
      encodeURIComponent(value) +
      '; expires=' +
      expires +
      '; path=/; SameSite=Lax; Secure';
  }

  // Resolve or create visitor ID (cookie primary, localStorage fallback for cookie-blocked contexts).
  var VISITOR_LS_KEY = '_tch_vid';

  function readVisitorId() {
    var fromCookie = getCookie(CONFIG.visitorCookieName);
    if (fromCookie) return fromCookie;
    try { return localStorage.getItem(VISITOR_LS_KEY); } catch (_e) { return null; }
  }

  function writeVisitorId(id) {
    setCookie(CONFIG.visitorCookieName, id, CONFIG.cookieDays);
    try { localStorage.setItem(VISITOR_LS_KEY, id); } catch (_e) {}
  }

  var isNewVisitor = false;
  var visitorId = readVisitorId();
  if (!visitorId) {
    visitorId = generateId();
    isNewVisitor = true;
  }
  writeVisitorId(visitorId);

  // Session ID -- lives only for the browser session (sessionStorage).
  var sessionId;
  try {
    sessionId = sessionStorage.getItem(CONFIG.sessionStorageKey);
    if (!sessionId) {
      sessionId = generateId();
      sessionStorage.setItem(CONFIG.sessionStorageKey, sessionId);
    }
  } catch (_e) {
    // sessionStorage blocked (e.g. Safari private mode) -- in-memory fallback.
    sessionId = generateId();
  }

  var isEntryPage = true;

  // ---------------------------------------------------------------------------
  // UTM extraction
  // ---------------------------------------------------------------------------

  function extractUtm() {
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (_e) {
      return undefined;
    }

    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var utm = {};
    var hasAny = false;

    for (var i = 0; i < keys.length; i++) {
      var val = params.get(keys[i]);
      if (val) {
        utm[keys[i].replace('utm_', '')] = val;
        hasAny = true;
      }
    }

    return hasAny ? utm : undefined;
  }

  // ---------------------------------------------------------------------------
  // Device info
  // ---------------------------------------------------------------------------

  function getDeviceInfo() {
    var vw = window.innerWidth || 0;
    var vh = window.innerHeight || 0;

    var deviceType = 'desktop';
    if (vw <= 480) deviceType = 'mobile';
    else if (vw <= 1024) deviceType = 'tablet';

    var info = {
      type: deviceType,
      viewportWidth: vw,
      viewportHeight: vh,
      screenWidth: screen.width || 0,
      screenHeight: screen.height || 0,
      pixelRatio: window.devicePixelRatio || 1,
      language: navigator.language || 'en',
      userAgent: navigator.userAgent || '',
    };

    // Network Information API (Chromium only).
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && conn.effectiveType) {
      info.connection = conn.effectiveType;
    }

    return info;
  }

  // ---------------------------------------------------------------------------
  // Performance metrics
  // ---------------------------------------------------------------------------

  function getPerformanceMetrics() {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) return undefined;

    var navEntries = performance.getEntriesByType('navigation');
    if (!navEntries || navEntries.length === 0) return undefined;

    var nav = navEntries[0];
    var metrics = {};

    if (nav.domContentLoadedEventEnd > 0) {
      metrics.domContentLoaded = Math.round(nav.domContentLoadedEventEnd - nav.startTime);
    }
    if (nav.loadEventEnd > 0) {
      metrics.loadComplete = Math.round(nav.loadEventEnd - nav.startTime);
    }
    if (nav.responseStart > 0) {
      metrics.timeToFirstByte = Math.round(nav.responseStart - nav.requestStart);
    }
    if (nav.domainLookupEnd > 0 && nav.domainLookupStart > 0) {
      metrics.dnsLookup = Math.round(nav.domainLookupEnd - nav.domainLookupStart);
    }
    if (nav.connectEnd > 0 && nav.connectStart > 0) {
      metrics.tcpConnect = Math.round(nav.connectEnd - nav.connectStart);
    }
    if (nav.secureConnectionStart > 0 && nav.connectEnd > 0) {
      metrics.tlsHandshake = Math.round(nav.connectEnd - nav.secureConnectionStart);
    }
    if (nav.transferSize > 0) {
      metrics.transferSize = nav.transferSize;
    }

    // Paint timing entries.
    var paintEntries = performance.getEntriesByType('paint');
    for (var i = 0; i < paintEntries.length; i++) {
      if (paintEntries[i].name === 'first-paint') {
        metrics.firstPaint = Math.round(paintEntries[i].startTime);
      }
      if (paintEntries[i].name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = Math.round(paintEntries[i].startTime);
      }
    }

    return Object.keys(metrics).length > 0 ? metrics : undefined;
  }

  // ---------------------------------------------------------------------------
  // Navigation type detection
  // ---------------------------------------------------------------------------

  function getNavigationType(isSpa) {
    if (isSpa) return 'spa';

    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      var navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        var t = navEntries[0].type;
        if (t === 'back_forward') return 'back_forward';
        if (t === 'reload') return 'reload';
      }
    }

    return 'initial';
  }

  // ---------------------------------------------------------------------------
  // Build and send event
  // ---------------------------------------------------------------------------

  function buildEvent(isSpa) {
    var now = new Date().toISOString();
    var loc = window.location;

    var event = {
      metadata: {
        locale:           CONFIG.locale,
        pipeline:         CONFIG.pipeline,
        source:           CONFIG.source,
        eventName:        'PageLoaded',
        version:          CONFIG.version,
        brand:            CONFIG.brand,
        service:          CONFIG.service,
        module:           CONFIG.module,
        country:          '',
        externalId:       generateId(),
        occurredAt:       now,
        submittedAt:      now,
        correlationId:    '',
        tags:             [],
        secondarySchemas: [],
        identity: {
          fp:        visitorId,
          sessionId: sessionId,
        },
        pd:             false,
        sc:             CONFIG.sc,
        synthetic:      false,
        ingestionType:  'single',
        discoverable:   true,
      },
      payload: {
        url:          loc.origin + loc.pathname + loc.search,
        path:         loc.pathname,
        referrer:     document.referrer || '',
        title:        document.title || '',
        timestamp:    now,
        visitorId:    visitorId,
        sessionId:    sessionId,
        isNewVisitor: isNewVisitor,
        device:       getDeviceInfo(),
        navigation: {
          type:      getNavigationType(isSpa),
          entryPage: isEntryPage,
        },
      },
    };

    // Performance metrics are only meaningful on full page loads.
    if (!isSpa) {
      var perf = getPerformanceMetrics();
      if (perf) {
        event.payload.performance = perf;
      }
    }

    // UTM parameters.
    var utm = extractUtm();
    if (utm) {
      event.payload.utm = utm;
    }

    return event;
  }

  function send(event) {
    var body = JSON.stringify(event);

    // Use fetch with keepalive + credentials:omit.
    // sendBeacon with a JSON Blob triggers a preflight; the Tachyon ingress returns
    // Access-Control-Allow-Credentials:true alongside Allow-Origin:* which browsers
    // reject. fetch with credentials:omit sidesteps that constraint entirely.
    if (typeof fetch === 'function') {
      fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true,
        mode: 'cors',
        credentials: 'omit',
      }).catch(function () {
        // Silently swallow -- analytics must never break the page.
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Trigger: initial page load
  // ---------------------------------------------------------------------------

  function trackPageLoad(isSpa) {
    try {
      var event = buildEvent(isSpa);
      send(event);
    } catch (_e) {
      // Swallow -- analytics is non-critical.
    }

    // After the first track call, visitor is no longer new and no longer on entry page.
    isNewVisitor = false;
    isEntryPage = false;
  }

  // Wait for the page to fully load so performance metrics are available.
  if (document.readyState === 'complete') {
    trackPageLoad(false);
  } else {
    window.addEventListener('load', function () {
      // Small delay to ensure paint timing entries are flushed.
      setTimeout(function () {
        trackPageLoad(false);
      }, 100);
    });
  }

  // ---------------------------------------------------------------------------
  // Trigger: SPA navigations
  // ---------------------------------------------------------------------------

  // Detect Astro ViewTransitions: if astro:page-load fires on initial load,
  // we know Astro is managing navigation and the History API fallback is not needed.
  var astroDetected = false;
  var initialLoadTracked = false;

  // Astro ViewTransitions fire 'astro:page-load' after every navigation.
  document.addEventListener('astro:page-load', function () {
    astroDetected = true;
    // The initial page load also fires this event -- skip the double-send.
    if (!initialLoadTracked) return;
    trackPageLoad(true);
  });

  // Mark initial load as tracked once the window.load handler fires.
  var origTrack = trackPageLoad;
  trackPageLoad = function (isSpa) {
    origTrack(isSpa);
    if (!isSpa) initialLoadTracked = true;
  };

  // Generic History API fallback for non-Astro SPAs.
  var _pushState = history.pushState;
  var _replaceState = history.replaceState;

  function onHistoryChange() {
    // If Astro is handling navigation, let astro:page-load do the tracking.
    if (astroDetected) return;
    // Short delay to allow framework to update document.title and location.
    setTimeout(function () {
      trackPageLoad(true);
    }, 50);
  }

  history.pushState = function () {
    _pushState.apply(history, arguments);
    onHistoryChange();
  };

  history.replaceState = function () {
    _replaceState.apply(history, arguments);
    onHistoryChange();
  };

  window.addEventListener('popstate', function () {
    if (astroDetected) return;
    setTimeout(function () {
      trackPageLoad(true);
    }, 50);
  });
})();
