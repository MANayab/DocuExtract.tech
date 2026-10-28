#!/usr/bin/env node
/**
 * Dependency-free static checks for the DocuExtract marketing site.
 * Run from the repository root: node scripts/validate.mjs
 * Includes live sitemap URL checks; requires network access.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const htmlFiles = ['index.html', '404.html', 'how-it-works/index.html', 'faq/index.html', 'roadmap/index.html', 'privacy/index.html', 'developer/index.html'];
const errors = [];
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const urls = new Set();
for (const file of htmlFiles) {
  const html = read(file);
  const jsonScripts = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']\s*>([\s\S]*?)<\/script>/gi)];
  for (const [i, match] of jsonScripts.entries()) {
    try { JSON.parse(match[1]); }
    catch (error) { errors.push(`${file}: JSON-LD block ${i + 1} invalid: ${error.message}`); }
  }
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  const og = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i)?.[1];
  if (!canonical || canonical !== og) errors.push(`${file}: canonical and og:url missing or different`);
  if (canonical) urls.add(canonical);
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"'#]+)["']/gi)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(value)) continue;
    const target = path.normalize(path.join(path.dirname(path.join(root, file)), decodeURIComponent(value.split(/[?#]/)[0])));
    if (!target.startsWith(root + path.sep) && target !== root) continue;
    if (!fs.existsSync(target) && !fs.existsSync(path.join(target, 'index.html'))) errors.push(`${file}: local link/asset missing: ${value}`);
  }
}
const sitemap = read('sitemap.xml');
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = match[1];
  if (!urls.has(url)) errors.push(`sitemap URL has no matching canonical in checked pages: ${url}`);
}
// Check that each public sitemap URL responds; this part requires network access.
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = match[1];
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) });
    if (!response.ok || response.status === 405) response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(12000) });
    if (!response.ok) errors.push('sitemap URL does not resolve (' + response.status + '): ' + url);
  } catch (error) {
    errors.push('sitemap URL request failed: ' + url + ' (' + error.message + ')');
  }
}
if (errors.length) {
  console.error('FAIL: marketing-site validation');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: JSON-LD syntax, canonical/og:url consistency, local links/assets, and sitemap-to-canonical mapping (${htmlFiles.length} HTML pages).`);
}
console.log('NOTE: visual rendering, OCR asset requests and CSP response headers still require browser verification.');
