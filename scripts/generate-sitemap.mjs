#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');
const baseUrl = 'https://numericano.com';

/**
 * Recursively find all index.html files in dist
 */
function findIndexFiles(dir, baseDir = distDir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip non-page assets and special files
    if (entry.name === '404.html' || 
        entry.name === '_astro' ||
        entry.name === 'sitemap.xml' ||
        entry.name === 'robots.txt' ||
        entry.name === '.well-known') {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...findIndexFiles(fullPath, baseDir));
    } else if (entry.name === 'index.html') {
      // Convert dist/foo/bar/index.html → /foo/bar/
      const relPath = path.relative(baseDir, fullPath);
      const urlPath = '/' + relPath
        .replace(/\\/g, '/') // Windows path separator
        .replace(/\/index\.html$/, '')
        .replace(/\/$/, '') // Remove trailing slash
        + '/'; // Add trailing slash back
      
      files.push(urlPath);
    }
  }

  return files;
}

/**
 * Generate sitemap.xml
 */
function generateSitemap() {
  try {
    if (!fs.existsSync(distDir)) {
      console.error(`❌ dist folder not found at ${distDir}`);
      process.exit(1);
    }

    // Find all pages
    const pages = findIndexFiles(distDir);
    
    if (pages.length === 0) {
      console.warn('⚠️  No pages found in dist/');
      return;
    }

    // Sort for consistent output
    pages.sort();

    // Build XML
    const urls = pages.map(page => `  <url>
    <loc>${baseUrl}${page}</loc>
  </url>`).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    // Write sitemap
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    
    console.log(`✅ Sitemap generated: ${sitemapPath}`);
    console.log(`   Total URLs: ${pages.length}`);
    
    // Show sample
    console.log(`\n   Sample URLs (first 5):`);
    pages.slice(0, 5).forEach(page => {
      console.log(`     - ${page}`);
    });

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
