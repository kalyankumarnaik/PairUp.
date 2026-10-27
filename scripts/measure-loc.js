#!/usr/bin/env node
/**
 * PairUp AI - Source Code Line Count Analyzer
 * Accurately measures authored source lines, tests, database scripts,
 * and infrastructure while strictly excluding node_modules, generated code,
 * build artifacts, lockfiles, and third-party libraries.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  '.turbo',
  'dist',
  'build',
  'out',
  '.output',
  'coverage',
  '.pnpm-store',
  'generated',
  '.system_generated'
]);

const EXCLUDED_FILES = new Set([
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  'powershell.cmd'
]);

const VALID_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.prisma',
  '.sql',
  '.json',
  '.yml',
  '.yaml',
  '.css',
  '.html',
  '.md'
]);

function countLinesInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let total = lines.length;
    let code = 0;
    let comments = 0;
    let blank = 0;

    let inBlockComment = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        blank++;
        continue;
      }

      if (inBlockComment) {
        comments++;
        if (line.includes('*/')) inBlockComment = false;
        continue;
      }

      if (line.startsWith('/*')) {
        comments++;
        if (!line.includes('*/')) inBlockComment = true;
        continue;
      }

      if (line.startsWith('//') || line.startsWith('#') || line.startsWith('--')) {
        comments++;
        continue;
      }

      code++;
    }

    return { total, code, comments, blank };
  } catch (err) {
    return { total: 0, code: 0, comments: 0, blank: 0 };
  }
}

function scanDirectory(dir, stats = {}) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      scanDirectory(fullPath, stats);
    } else if (entry.isFile()) {
      if (EXCLUDED_FILES.has(entry.name)) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!VALID_EXTENSIONS.has(ext)) continue;

      const fileStats = countLinesInFile(fullPath);
      classifyFile(relativePath, fileStats, stats);
    }
  }

  return stats;
}

function classifyFile(relPath, counts, stats) {
  let category = 'Other';

  if (relPath.includes('.spec.') || relPath.includes('.test.') || relPath.startsWith('packages/test-utils/')) {
    category = 'Automated Tests';
  } else if (relPath.startsWith('apps/web/')) {
    category = 'Website (React/Vite)';
  } else if (relPath.startsWith('apps/mobile/')) {
    category = 'Mobile App (React Native/Expo)';
  } else if (relPath.startsWith('apps/api/src/modules/chat/') || relPath.startsWith('apps/api/src/modules/calls/')) {
    category = 'Real-Time Communication';
  } else if (relPath.startsWith('apps/api/src/modules/ai/')) {
    category = 'AI Services';
  } else if (relPath.startsWith('apps/api/src/modules/admin/') || relPath.startsWith('apps/web/src/pages/admin/')) {
    category = 'Admin & Analytics';
  } else if (relPath.startsWith('apps/api/')) {
    category = 'Backend Domains (NestJS)';
  } else if (relPath.startsWith('apps/worker/')) {
    category = 'Background Worker';
  } else if (relPath.startsWith('packages/')) {
    category = 'Shared Packages (Contracts/Types/Tokens/Client)';
  } else if (relPath.startsWith('database/')) {
    category = 'Database & Seeds';
  } else if (relPath.startsWith('infrastructure/') || relPath.startsWith('scripts/') || relPath.startsWith('.github/')) {
    category = 'Infrastructure & Tooling';
  } else if (relPath.startsWith('docs/')) {
    category = 'Documentation & Specifications';
  }

  if (!stats[category]) {
    stats[category] = { files: 0, total: 0, code: 0, comments: 0, blank: 0 };
  }

  stats[category].files += 1;
  stats[category].total += counts.total;
  stats[category].code += counts.code;
  stats[category].comments += counts.comments;
  stats[category].blank += counts.blank;
}

function main() {
  console.log('\n============================================================');
  console.log('  PAIRUP AI - AUTHORED SOURCE CODE METRICS');
  console.log('============================================================\n');

  const stats = scanDirectory(ROOT_DIR);

  let grandTotal = 0;
  let grandCode = 0;
  let grandComments = 0;
  let grandFiles = 0;

  console.log(
    'Category'.padEnd(42) +
    'Files'.padStart(8) +
    'Code'.padStart(12) +
    'Comments'.padStart(12) +
    'Total LOC'.padStart(12)
  );
  console.log('-'.repeat(86));

  const sortedCategories = Object.keys(stats).sort();

  for (const cat of sortedCategories) {
    const item = stats[cat];
    grandFiles += item.files;
    grandTotal += item.total;
    grandCode += item.code;
    grandComments += item.comments;

    console.log(
      cat.padEnd(42) +
      String(item.files).padStart(8) +
      String(item.code).padStart(12) +
      String(item.comments).padStart(12) +
      String(item.total).padStart(12)
    );
  }

  console.log('='.repeat(86));
  console.log(
    'TOTAL AUTHORED SOURCE'.padEnd(42) +
    String(grandFiles).padStart(8) +
    String(grandCode).padStart(12) +
    String(grandComments).padStart(12) +
    String(grandTotal).padStart(12)
  );
  console.log('\nExclusions: node_modules, .turbo, dist, coverage, lockfiles, system shims.\n');
}

main();
