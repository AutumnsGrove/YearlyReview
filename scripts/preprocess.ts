/**
 * Phase 0: Preprocess journal entries
 *
 * This script handles:
 * 1. Scan Journal/ directories
 * 2. Strip Meta Bind blocks
 * 3. Normalize internal links ([[Folder/Person]] → [[Person]])
 * 4. Validate/fix dates
 * 5. Create manifest.json with all entry metadata
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';
import { createHash } from 'crypto';

// ============================================================================
// Types (aligned with infrastructure/src/schemas/types.ts)
// ============================================================================

interface ManifestEntry {
  date: string;
  originalPath: string;
  r2Key: string;
  wordCount: number;
  contentHash: string;
}

interface Manifest {
  generatedAt: string;
  totalEntries: number;
  dateRange: {
    start: string;
    end: string;
  };
  entries: ManifestEntry[];
}

interface ProcessedEntry {
  date: string;
  originalPath: string;
  cleanedContent: string;
  wordCount: number;
  contentHash: string;
  warnings: string[];
}

interface PreprocessConfig {
  journalDirs: string[];
  outputDir: string;
  manifestPath: string;
}

// ============================================================================
// Content Processing Functions
// ============================================================================

/**
 * Strip Meta Bind button blocks from content
 * Matches: ```meta-bind-button ... ```
 */
function stripMetaBindBlocks(content: string): string {
  // Match fenced code blocks with meta-bind-button
  const metaBindPattern = /```meta-bind-button[\s\S]*?```/g;
  return content.replace(metaBindPattern, '').trim();
}

/**
 * Normalize internal wiki links
 * [[Folder/Person]] → [[Person]]
 * [[Folder/SubFolder/Note]] → [[Note]]
 */
function normalizeWikiLinks(content: string): string {
  // Match [[...]] and extract just the final part after any /
  const wikiLinkPattern = /\[\[([^\]]+)\]\]/g;
  return content.replace(wikiLinkPattern, (match, linkContent) => {
    // Handle links with display text: [[path/to/Note|Display Text]]
    const [path, displayText] = linkContent.split('|');
    const normalizedPath = path.includes('/') ? path.split('/').pop() : path;

    if (displayText) {
      return `[[${normalizedPath}|${displayText}]]`;
    }
    return `[[${normalizedPath}]]`;
  });
}

/**
 * Extract frontmatter from markdown content
 * Returns the frontmatter as an object and the content without frontmatter
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const match = content.match(frontmatterPattern);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length);

  // Simple YAML parsing for common fields
  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value: string | boolean = line.slice(colonIndex + 1).trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parse booleans
      if (value === 'true') value = true as unknown as string;
      if (value === 'false') value = false as unknown as string;

      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

/**
 * Extract date from filename (expects YYYY-MM-DD.md format)
 */
function extractDateFromFilename(filename: string): string | null {
  const datePattern = /^(\d{4}-\d{2}-\d{2})\.md$/;
  const match = filename.match(datePattern);
  return match ? match[1] : null;
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function isValidDate(dateStr: string): boolean {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(dateStr)) return false;

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Count words in text (excluding code blocks and frontmatter)
 */
function countWords(text: string): number {
  // Remove code blocks
  const withoutCode = text.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  const withoutInlineCode = withoutCode.replace(/`[^`]+`/g, '');
  // Count words
  const words = withoutInlineCode.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

/**
 * Generate SHA-256 hash of content
 */
function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

// ============================================================================
// File System Operations
// ============================================================================

/**
 * Recursively find all .md files in a directory
 */
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  if (!existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return files;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Process a single journal entry
 */
function processEntry(filePath: string, baseDir: string): ProcessedEntry | null {
  const warnings: string[] = [];
  const filename = basename(filePath);
  const relativePath = filePath.replace(baseDir, '').replace(/^\//, '');

  // Extract date from filename
  const filenameDate = extractDateFromFilename(filename);

  if (!filenameDate) {
    warnings.push(`Filename does not match YYYY-MM-DD.md format: ${filename}`);
  }

  // Read and parse content
  const rawContent = readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(rawContent);

  // Check frontmatter date
  const frontmatterDate = frontmatter.date as string | undefined;
  let finalDate = filenameDate;

  if (frontmatterDate && filenameDate) {
    // Normalize frontmatter date (might be in different format)
    const normalizedFmDate = frontmatterDate.slice(0, 10); // Take first 10 chars
    if (normalizedFmDate !== filenameDate) {
      warnings.push(`Date mismatch: filename=${filenameDate}, frontmatter=${normalizedFmDate}`);
    }
  } else if (frontmatterDate && !filenameDate) {
    finalDate = frontmatterDate.slice(0, 10);
    warnings.push(`Using frontmatter date (filename invalid): ${finalDate}`);
  }

  if (!finalDate || !isValidDate(finalDate)) {
    console.error(`[SKIP] Cannot determine valid date for: ${filePath}`);
    return null;
  }

  // Clean content
  let cleanedContent = stripMetaBindBlocks(rawContent);
  cleanedContent = normalizeWikiLinks(cleanedContent);

  // Calculate metrics
  const wordCount = countWords(body);
  const contentHash = hashContent(cleanedContent);

  return {
    date: finalDate,
    originalPath: relativePath,
    cleanedContent,
    wordCount,
    contentHash,
    warnings,
  };
}

// ============================================================================
// Main Preprocessing Pipeline
// ============================================================================

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Phase 0: Journal Preprocessing');
  console.log('='.repeat(60));

  // Configuration
  const projectRoot = process.cwd();
  const config: PreprocessConfig = {
    journalDirs: [
      join(projectRoot, 'Journal', '2024'),
      join(projectRoot, 'Journal', '2025'),
    ],
    outputDir: join(projectRoot, 'preprocessed'),
    manifestPath: join(projectRoot, 'preprocessed', 'manifest.json'),
  };

  // Ensure output directory exists
  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
    console.log(`Created output directory: ${config.outputDir}`);
  }

  // Find all journal files
  console.log('\nScanning for journal entries...');
  const allFiles: string[] = [];

  for (const journalDir of config.journalDirs) {
    if (existsSync(journalDir)) {
      const files = findMarkdownFiles(journalDir);
      allFiles.push(...files);
      console.log(`  Found ${files.length} entries in ${journalDir}`);
    } else {
      console.log(`  [WARN] Directory not found: ${journalDir}`);
    }
  }

  if (allFiles.length === 0) {
    console.log('\nNo journal entries found. Nothing to preprocess.');
    console.log('Place your journal entries in:');
    config.journalDirs.forEach(d => console.log(`  - ${d}`));

    // Create empty manifest
    const emptyManifest: Manifest = {
      generatedAt: new Date().toISOString(),
      totalEntries: 0,
      dateRange: { start: '', end: '' },
      entries: [],
    };
    writeFileSync(config.manifestPath, JSON.stringify(emptyManifest, null, 2));
    console.log(`\nCreated empty manifest: ${config.manifestPath}`);
    return;
  }

  // Process each entry
  console.log(`\nProcessing ${allFiles.length} entries...`);
  const processedEntries: ProcessedEntry[] = [];
  const skippedFiles: string[] = [];
  const allWarnings: { file: string; warnings: string[] }[] = [];

  for (const filePath of allFiles) {
    const baseDir = dirname(dirname(dirname(filePath))); // Go up to project root
    const result = processEntry(filePath, projectRoot);

    if (result) {
      processedEntries.push(result);
      if (result.warnings.length > 0) {
        allWarnings.push({ file: result.originalPath, warnings: result.warnings });
      }
    } else {
      skippedFiles.push(filePath);
    }
  }

  // Sort by date
  processedEntries.sort((a, b) => a.date.localeCompare(b.date));

  // Write preprocessed entries
  console.log('\nWriting preprocessed entries...');
  for (const entry of processedEntries) {
    const outputPath = join(config.outputDir, `${entry.date}.md`);
    writeFileSync(outputPath, entry.cleanedContent);
  }

  // Build manifest
  const manifestEntries: ManifestEntry[] = processedEntries.map(entry => ({
    date: entry.date,
    originalPath: entry.originalPath,
    r2Key: `journals/${entry.date}.md`,
    wordCount: entry.wordCount,
    contentHash: entry.contentHash,
  }));

  const dates = manifestEntries.map(e => e.date).sort();
  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    totalEntries: manifestEntries.length,
    dateRange: {
      start: dates[0] || '',
      end: dates[dates.length - 1] || '',
    },
    entries: manifestEntries,
  };

  // Write manifest
  writeFileSync(config.manifestPath, JSON.stringify(manifest, null, 2));

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Preprocessing Complete');
  console.log('='.repeat(60));
  console.log(`  Total entries processed: ${processedEntries.length}`);
  console.log(`  Entries skipped:         ${skippedFiles.length}`);
  console.log(`  Date range:              ${manifest.dateRange.start} to ${manifest.dateRange.end}`);
  console.log(`  Output directory:        ${config.outputDir}`);
  console.log(`  Manifest:                ${config.manifestPath}`);

  // Report warnings
  if (allWarnings.length > 0) {
    console.log(`\n[WARNINGS] ${allWarnings.length} entries had issues:`);
    for (const { file, warnings } of allWarnings.slice(0, 10)) {
      console.log(`  ${file}:`);
      warnings.forEach(w => console.log(`    - ${w}`));
    }
    if (allWarnings.length > 10) {
      console.log(`  ... and ${allWarnings.length - 10} more`);
    }
  }

  // Report skipped files
  if (skippedFiles.length > 0) {
    console.log(`\n[SKIPPED] ${skippedFiles.length} files could not be processed:`);
    for (const file of skippedFiles.slice(0, 5)) {
      console.log(`  - ${file}`);
    }
    if (skippedFiles.length > 5) {
      console.log(`  ... and ${skippedFiles.length - 5} more`);
    }
  }

  console.log('\nNext step: Run `pnpm upload` to upload entries to R2');
}

main().catch(console.error);
