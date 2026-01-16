#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

/**
 * Recursively find all index.html files in dist
 */
function findPages(dir) {
  const pages = {
    total: 0,
    cookingHubs: 0,
    conversions: 0,
    ingredients: 0,
    other: 0,
    list: []
  };

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      // Skip asset directories
      if (entry.name === '_astro' || entry.name === '.well-known') {
        continue;
      }

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.name === 'index.html') {
        const relPath = path.relative(distDir, fullPath);
        const urlPath = '/' + relPath.replace(/\\/g, '/').replace(/\/index\.html$/, '') + '/';
        
        pages.total++;
        pages.list.push(urlPath);

        // Categorize
        if (urlPath.includes('/cooking/') && urlPath.match(/\/cooking\/[^/]+\/[^/]+-to-[^/]+\/$/)) {
          // Conversion pages: /cooking/{ingredient}/{from}-to-{to}/
          pages.conversions++;
        } else if (urlPath === '/cooking/') {
          // Cooking hub page: /cooking/
          pages.other++;
        } else if (urlPath.match(/\/cooking\/[^/]+\/$/)) {
          // Cooking ingredient hubs: /cooking/{ingredient}/
          pages.cookingHubs++;
        } else if (urlPath === '/ingredients/') {
          // Ingredients hub page: /ingredients/
          pages.other++;
        } else if (urlPath === '/ingredients/browse/') {
          // Browse page: /ingredients/browse/
          pages.ingredients++;
        } else if (urlPath.match(/\/ingredients\/[^/]+\/$/)) {
          // Individual ingredient pages: /ingredients/{slug}/
          pages.ingredients++;
        } else {
          pages.other++;
        }
      }
    }
  }

  traverse(dir);
  return pages;
}

/**
 * Main
 */
function main() {
  try {
    if (!fs.existsSync(distDir)) {
      console.error(`❌ dist folder not found at ${distDir}`);
      process.exit(1);
    }

    const pages = findPages(distDir);

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║        NUMERICANO PAGE COUNTS          ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log(`  📊 Total Pages:              ${pages.total}`);
    console.log(`     ├─ Cooking Hubs:        ${pages.cookingHubs}`);
    console.log(`     ├─ Conversion Pages:    ${pages.conversions}`);
    console.log(`     ├─ Ingredient Pages:    ${pages.ingredients}`);
    console.log(`     └─ Other Pages:         ${pages.other}`);

    console.log(`\n  Breakdown:`);
    console.log(`     • Cooking (hubs + conversions): ${pages.cookingHubs + pages.conversions}`);
    console.log(`     • Total ingredient-related:     ${pages.ingredients + pages.cookingHubs + pages.conversions}`);

    console.log(`\n  Expected:
     • Cooking hubs: 50 (one per ingredient in first 50)
     • Conversions:  500 (50 ingredients × 10 pairs)
     • Ingredients:  51 (50 individual + 1 browse page)
     • Other:        10 (home, about, blog, cooking hub, ingredients hub)
     • Total pages:  611\n`);

    // Validation
    console.log('  ✓ Validation:');
    let allGood = true;

    if (pages.cookingHubs === 50) {
      console.log('    ✓ Cooking hubs: 50');
    } else {
      console.log(`    ✗ Cooking hubs: ${pages.cookingHubs} (expected 50)`);
      allGood = false;
    }

    if (pages.conversions === 500) {
      console.log('    ✓ Conversion pages: 500');
    } else {
      console.log(`    ✗ Conversion pages: ${pages.conversions} (expected 500)`);
      allGood = false;
    }

    if (pages.ingredients === 51) {
      console.log('    ✓ Ingredient pages: 51 (50 + browse)');
    } else {
      console.log(`    ✗ Ingredient pages: ${pages.ingredients} (expected 51)`);
      allGood = false;
    }

    if (pages.other === 10) {
      console.log('    ✓ Other pages: 10');
    } else {
      console.log(`    ✗ Other pages: ${pages.other} (expected 10)`);
      allGood = false;
    }

    console.log();

    if (!allGood) {
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error counting pages:', error);
    process.exit(1);
  }
}

main();
