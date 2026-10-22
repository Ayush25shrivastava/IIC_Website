import fs from 'node:fs';
import path from 'node:path';

function checkFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`[FAIL] ${label}: File not found at ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const verMatches = content.match(/google-site-verification/g) || [];
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  const canMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
  const jsonLdMatch = content.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  const hasPrerender = content.includes('<div id="root"><noscript>');

  console.log(`=== ${label} (${filePath}) ===`);
  console.log(`  Verification tag count: ${verMatches.length} ${verMatches.length === 1 ? '✓' : '✗'}`);
  console.log(`  Title:                  ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`);
  console.log(`  Description:            ${descMatch ? descMatch[1].slice(0, 60) + '...' : 'NOT FOUND'}`);
  console.log(`  Canonical URL:          ${canMatch ? canMatch[1] : 'NOT FOUND'}`);
  console.log(`  JSON-LD present:        ${jsonLdMatch ? '✓' : '✗'}`);
  console.log(`  Prerender fallback:     ${hasPrerender ? '✓' : '✗'}`);
}

console.log('\n--- VERIFYING FRONTEND DIST ARTIFACTS ---');
checkFile('frontend/dist/index.html', 'Global Homepage');
checkFile('frontend/dist/udbhav/index.html', 'Udbhav Landing Page');
checkFile('frontend/dist/renaissance/index.html', 'Renaissance Landing Page');
checkFile('frontend/dist/robots.txt', 'Robots.txt');
checkFile('frontend/dist/sitemap.xml', 'Sitemap.xml');

console.log('\n--- VERIFYING RENAISSANCE CLIENT DIST ARTIFACTS ---');
checkFile('RENAISSANCE-ECELL-2026/client/dist/index.html', 'Client Homepage');
checkFile('RENAISSANCE-ECELL-2026/client/dist/renaissance/index.html', 'Client Renaissance Page');
checkFile('RENAISSANCE-ECELL-2026/client/dist/robots.txt', 'Client Robots.txt');
checkFile('RENAISSANCE-ECELL-2026/client/dist/sitemap.xml', 'Client Sitemap.xml');
