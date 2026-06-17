#!/usr/bin/env node
/**
 * Tachyon emit health-check.
 *
 * Reads the ACTUAL endpoint + schema version out of public/tachyon-emit.js,
 * sends one synthetic PageLoaded event, and asserts the ingress accepts it (201).
 *
 * Why this exists: in May 2026 a commit bumped CONFIG.version 1 -> 2 with no
 * matching backend schema, so every event silently 404'd and analytics stopped
 * landing for weeks with zero signal. This check turns that exact failure into a
 * loud, non-zero exit — run it after any tracker change and on a schedule (CI).
 *
 * Usage:
 *   node scripts/check-tachyon.mjs            # check the committed local script
 *   node scripts/check-tachyon.mjs --deployed # also check the live deployed script
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const LOCAL_PATH = resolve(process.cwd(), 'public/tachyon-emit.js');
const DEPLOYED_URL = 'https://1digit.co.uk/tachyon-emit.js';

function parseConfig(src) {
  const version = src.match(/version:\s*(\d+)/);
  const base = src.match(/endpointBase:\s*'([^']+)'/);
  const endpoint = src.match(/endpoint:\s*'([^']+)'/);
  if (!version) throw new Error('Could not find CONFIG.version in tachyon-emit.js');
  // Prefer endpointBase + /PageLoaded; fall back to the literal endpoint.
  const url = base ? `${base[1]}/PageLoaded` : endpoint?.[1];
  if (!url) throw new Error('Could not find a Tachyon endpoint in tachyon-emit.js');
  return { version: Number(version[1]), url };
}

// A representative PageLoaded envelope, matching the shape the browser sends.
function buildEvent(version) {
  const now = new Date().toISOString();
  return {
    metadata: {
      locale: 'en_GB', pipeline: 'Website', source: 'Vivid', eventName: 'PageLoaded',
      version, brand: '1Digit', service: 'web', module: '1Digit Tachyon', country: '',
      externalId: `healthcheck-${Date.now()}`, occurredAt: now, submittedAt: now,
      // NOTE: the PageLoaded schema rejects a non-empty tags array (400); the real
      // tracker always sends []. Keep this empty — synthetic:true marks it a test.
      correlationId: '', tags: [], secondarySchemas: [],
      identity: { fp: 'healthcheck', sessionId: 'healthcheck' },
      pd: false, sc: 'public', synthetic: true, ingestionType: 'single', discoverable: true,
    },
    payload: {
      url: 'https://1digit.co.uk/', path: '/', referrer: '', title: '1Digit healthcheck',
      timestamp: now, visitorId: 'healthcheck', sessionId: 'healthcheck',
      device: {
        type: 'desktop', viewportWidth: 1200, viewportHeight: 800, screenWidth: 1200,
        screenHeight: 800, pixelRatio: 1, language: 'en-GB', userAgent: 'tachyon-healthcheck', connection: '4g',
      },
      isNewVisitor: true, navigation: { type: 'initial', entryPage: true },
    },
  };
}

async function check(label, src) {
  const { version, url } = parseConfig(src);
  console.log(`\n[${label}] endpoint=${url}  version=${version}`);
  let res, body;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://1digit.co.uk' },
      body: JSON.stringify(buildEvent(version)),
    });
    body = await res.text();
  } catch (err) {
    console.error(`✗ [${label}] network error reaching Tachyon: ${err.message}`);
    return false;
  }
  if (res.status >= 200 && res.status < 300) {
    console.log(`✓ [${label}] Tachyon accepted PageLoaded v${version} (HTTP ${res.status})`);
    return true;
  }
  console.error(`✗ [${label}] Tachyon REJECTED PageLoaded v${version} — HTTP ${res.status} (${body.slice(0, 120)})`);
  if (res.status === 404) {
    console.error(`   → 404 = no schema registered for version ${version}. The emitter version and the`);
    console.error(`     backend schema version are out of sync. Revert the version, or register the schema.`);
  }
  return false;
}

const checkDeployed = process.argv.includes('--deployed');
let ok = await check('local', readFileSync(LOCAL_PATH, 'utf-8'));

if (checkDeployed) {
  try {
    const deployedSrc = await (await fetch(`${DEPLOYED_URL}?cb=${Date.now()}`)).text();
    ok = (await check('deployed', deployedSrc)) && ok;
  } catch (err) {
    console.error(`✗ [deployed] could not fetch ${DEPLOYED_URL}: ${err.message}`);
    ok = false;
  }
}

if (!ok) {
  console.error('\nTachyon health-check FAILED — events are not being accepted.');
  process.exit(1);
}
console.log('\nTachyon health-check passed.');
