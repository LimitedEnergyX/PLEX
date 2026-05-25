// update-analytics.js
// Pulls Netlify analytics via API, regenerates analytics.html, deploys.
// Weekly: node update-analytics.js (via Task Scheduler)

'use strict';

process.on('uncaughtException', err => {
  const clean = (err.stack || err.message).replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]');
  console.error(`[FATAL] ${clean}`);
  process.exit(1);
});

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── Config ─────────────────────────────────────────────────────────────────
const SITE_ID   = 'ed2f9096-6254-41af-8d01-6a1c144c5eb2';
const ROOT      = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'site', 'data', 'analytics-data.json');
const LOG_FILE  = path.join(__dirname, 'logs', `${today()}.log`);
const MODEL     = 'claude-sonnet-4-6';
const API_BASE  = 'https://api.netlify.com/api/v1';

// ── Helpers ─────────────────────────────────────────────────────────────────
function today() { return new Date().toISOString().slice(0, 10); }

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function die(msg) { log(`FATAL: ${msg}`); process.exit(1); }

async function netlifyGet(endpoint) {
  const token = process.env.NETLIFY_TOKEN;
  if (!token) die('NETLIFY_TOKEN not set.');
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Netlify API ${url} → ${res.status} ${await res.text()}`);
  return res.json();
}

// ── 7-day window ────────────────────────────────────────────────────────────
function getWindow() {
  const to   = new Date();
  const from = new Date(to - 7 * 24 * 60 * 60 * 1000);
  return {
    from: from.toISOString().slice(0, 10),
    to:   to.toISOString().slice(0, 10),
    fromTs: Math.floor(from.getTime() / 1000),
    toTs:   Math.floor(to.getTime()   / 1000),
  };
}

// ── Fetch Netlify data ──────────────────────────────────────────────────────
async function fetchAnalytics() {
  log('Fetching Netlify site info...');
  const site = await netlifyGet(`/sites/${SITE_ID}`);
  log(`Site: ${site.name} · ${site.url}`);

  log('Fetching deploy history...');
  const deploys = await netlifyGet(`/sites/${SITE_ID}/deploys?per_page=5`);
  const lastDeploy = deploys[0];

  const win = getWindow();
  log(`Analytics window: ${win.from} → ${win.to}`);

  // Netlify analytics endpoints
  const analyticsBase = `https://analytics.services.netlify.com/v2/${site.account_slug}/sites/${SITE_ID}`;
  const params = `from=${win.fromTs}&to=${win.toTs}&timezone=America%2FChicago`;

  let pageviews = null, visitors = null, sources = null, pages = null, notFound = null;

  try {
    pageviews = await netlifyGet(`${analyticsBase}/pageviews?${params}`);
    log(`Pageviews data: ${JSON.stringify(pageviews).slice(0, 100)}`);
  } catch(e) { log(`Pageviews unavailable: ${e.message}`); }

  try {
    visitors = await netlifyGet(`${analyticsBase}/visitors?${params}`);
    log(`Visitors data: ${JSON.stringify(visitors).slice(0, 100)}`);
  } catch(e) { log(`Visitors unavailable: ${e.message}`); }

  try {
    sources = await netlifyGet(`${analyticsBase}/sources?${params}&limit=10`);
    log(`Sources: ${JSON.stringify(sources).slice(0, 100)}`);
  } catch(e) { log(`Sources unavailable: ${e.message}`); }

  try {
    pages = await netlifyGet(`${analyticsBase}/pages?${params}&limit=10`);
    log(`Pages: ${JSON.stringify(pages).slice(0, 100)}`);
  } catch(e) { log(`Pages unavailable: ${e.message}`); }

  try {
    notFound = await netlifyGet(`${analyticsBase}/not_found?${params}&limit=10`);
    log(`Not found: ${JSON.stringify(notFound).slice(0, 100)}`);
  } catch(e) { log(`Not-found unavailable: ${e.message}`); }

  return {
    site,
    lastDeploy,
    window: win,
    pageviews,
    visitors,
    sources,
    pages,
    notFound,
  };
}

// ── Regenerate JSON ──────────────────────────────────────────────────────────
async function regenerateData(data) {
  if (!process.env.ANTHROPIC_API_KEY) die('ANTHROPIC_API_KEY not set.');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const schema = fs.readFileSync(DATA_FILE, 'utf8');

  log('Calling Claude to regenerate analytics-data.json...');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: `Transform this Netlify analytics API data into JSON matching this schema exactly.
Today: ${today()}. Window: ${data.window.from} to ${data.window.to}.
Generate insights and outstanding items based on the data patterns.
Return ONLY valid JSON, no explanation, no markdown fences.

SCHEMA (match this structure exactly):
${schema}

FRESH NETLIFY DATA:
${JSON.stringify(data, null, 2).slice(0, 6000)}`
    }]
  });

  const raw = response.content[0].text.trim().replace(/^```json|```$/g, '').trim();
  try { JSON.parse(raw); } catch(e) { die('Claude did not return valid JSON. Aborting: ' + e.message); }
  return raw;
}

// ── Deploy ──────────────────────────────────────────────────────────────────
function deploy() {
  log('Deploying to Netlify...');
  try {
    const out = execSync('netlify deploy --dir site --prod', {
      cwd: ROOT, encoding: 'utf8', timeout: 120000
    });
    log('Deploy output: ' + out.slice(0, 300));
  } catch(e) { log(`Deploy error: ${e.message}`); }
}

// ── Main ────────────────────────────────────────────────────────────────────
(async () => {
  log('=== Netlify analytics update started ===');

  const data = await fetchAnalytics();
  const newData = await regenerateData(data);

  const backup = DATA_FILE.replace('.json', `.bak.${today()}.json`);
  fs.copyFileSync(DATA_FILE, backup);
  log(`Backed up to ${backup}`);

  fs.writeFileSync(DATA_FILE, newData, 'utf8');
  log('analytics-data.json updated.');

  deploy();
  log('=== Netlify analytics update complete ===');
})();
