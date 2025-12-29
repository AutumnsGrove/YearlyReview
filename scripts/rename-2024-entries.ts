/**
 * Rename 2024 journal entries from verbose format to ISO date format
 *
 * Converts: "Month Day, Year.md" → "YYYY-MM-DD.md"
 * Example:  "November 16, 2024.md" → "2024-11-16.md"
 *
 * Also adds a `date:` field to frontmatter if missing.
 *
 * Usage: pnpm rename-2024
 */

import { readFileSync, writeFileSync, renameSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const MONTHS: Record<string, string> = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
};

/**
 * Parse verbose date format to ISO date
 * "November 16, 2024" → "2024-11-16"
 */
function parseVerboseDate(filename: string): string | null {
  // Match: "Month Day, Year.md"
  const pattern = /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\.md$/;
  const match = filename.match(pattern);

  if (!match) return null;

  const [, monthName, day, year] = match;
  const month = MONTHS[monthName.toLowerCase()];

  if (!month) {
    console.warn(`Unknown month: ${monthName}`);
    return null;
  }

  const paddedDay = day.padStart(2, '0');
  return `${year}-${month}-${paddedDay}`;
}

/**
 * Add date field to frontmatter if missing
 */
function ensureDateInFrontmatter(content: string, isoDate: string): string {
  const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterPattern);

  if (!match) {
    // No frontmatter, add it
    return `---\ndate: ${isoDate}\n---\n${content}`;
  }

  const frontmatter = match[1];

  // Check if date field exists
  if (/^date:/m.test(frontmatter)) {
    return content; // Already has date field
  }

  // Add date field after the opening ---
  const newFrontmatter = `date: ${isoDate}\n${frontmatter}`;
  return content.replace(frontmatterPattern, `---\n${newFrontmatter}\n---`);
}

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Rename 2024 Journal Entries');
  console.log('='.repeat(60));

  const journalDir = join(process.cwd(), 'Journal', '2024');

  if (!existsSync(journalDir)) {
    console.log(`Directory not found: ${journalDir}`);
    console.log('Create Journal/2024/ and add your entries first.');
    return;
  }

  const files = readdirSync(journalDir).filter((f) => f.endsWith('.md'));
  console.log(`\nFound ${files.length} markdown files in ${journalDir}\n`);

  let renamed = 0;
  let skipped = 0;
  let alreadyCorrect = 0;

  for (const filename of files) {
    const filePath = join(journalDir, filename);

    // Check if already in ISO format
    if (/^\d{4}-\d{2}-\d{2}\.md$/.test(filename)) {
      console.log(`  [OK] ${filename} (already ISO format)`);
      alreadyCorrect++;
      continue;
    }

    // Try to parse verbose date
    const isoDate = parseVerboseDate(filename);

    if (!isoDate) {
      console.log(`  [SKIP] ${filename} (unrecognized format)`);
      skipped++;
      continue;
    }

    const newFilename = `${isoDate}.md`;
    const newFilePath = join(journalDir, newFilename);

    // Check for conflicts
    if (existsSync(newFilePath)) {
      console.log(`  [CONFLICT] ${filename} → ${newFilename} already exists!`);
      skipped++;
      continue;
    }

    // Read content and ensure date in frontmatter
    let content = readFileSync(filePath, 'utf-8');
    content = ensureDateInFrontmatter(content, isoDate);

    // Write updated content
    writeFileSync(filePath, content);

    // Rename file
    renameSync(filePath, newFilePath);
    console.log(`  [RENAMED] ${filename} → ${newFilename}`);
    renamed++;
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`  Renamed:         ${renamed}`);
  console.log(`  Already correct: ${alreadyCorrect}`);
  console.log(`  Skipped:         ${skipped}`);

  if (renamed > 0) {
    console.log('\nNext step: Run `pnpm preprocess` to process the renamed entries.');
  }
}

main().catch(console.error);
