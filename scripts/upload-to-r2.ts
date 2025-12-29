/**
 * Upload preprocessed journals to R2
 *
 * This script:
 * 1. Reads manifest.json from preprocessing
 * 2. Uploads each journal entry to R2 (reflections-journals bucket)
 * 3. Uploads manifest.json
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

// ============================================================================
// Types
// ============================================================================

interface Secrets {
  CLOUDFLARE_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
}

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

interface UploadResult {
  key: string;
  success: boolean;
  skipped: boolean;
  error?: string;
}

// ============================================================================
// Configuration & Helpers
// ============================================================================

const BUCKET_NAME = 'reflections-journals';

function loadSecrets(secretsPath: string): Secrets {
  if (!existsSync(secretsPath)) {
    throw new Error(
      `Secrets file not found: ${secretsPath}\n` +
      `Copy secrets_template.json to secrets.json and fill in your credentials.`
    );
  }

  const content = readFileSync(secretsPath, 'utf-8');
  const secrets = JSON.parse(content) as Secrets;

  const required = ['CLOUDFLARE_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'];
  for (const key of required) {
    if (!secrets[key as keyof Secrets] || secrets[key as keyof Secrets].includes('your-')) {
      throw new Error(`Missing or invalid value for ${key} in secrets.json`);
    }
  }

  return secrets;
}

function createR2Client(secrets: Secrets): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${secrets.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: secrets.R2_ACCESS_KEY_ID,
      secretAccessKey: secrets.R2_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Check if an object exists in R2 with the same content hash
 */
async function objectExists(client: S3Client, key: string, contentHash: string): Promise<boolean> {
  try {
    const response = await client.send(new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    // Check if content hash matches (stored in metadata)
    return response.Metadata?.['content-hash'] === contentHash;
  } catch {
    return false;
  }
}

/**
 * Upload a single file to R2
 */
async function uploadFile(
  client: S3Client,
  key: string,
  content: string,
  contentHash: string,
  skipIfExists: boolean = true
): Promise<UploadResult> {
  try {
    // Check if already uploaded with same hash
    if (skipIfExists && await objectExists(client, key, contentHash)) {
      return { key, success: true, skipped: true };
    }

    await client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: content,
      ContentType: 'text/markdown',
      Metadata: {
        'content-hash': contentHash,
      },
    }));

    return { key, success: true, skipped: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { key, success: false, skipped: false, error: message };
  }
}

// ============================================================================
// Main Upload Pipeline
// ============================================================================

async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Phase 0: Upload to R2');
  console.log('='.repeat(60));

  const projectRoot = process.cwd();
  const secretsPath = join(projectRoot, 'secrets.json');
  const preprocessedDir = join(projectRoot, 'preprocessed');
  const manifestPath = join(preprocessedDir, 'manifest.json');

  // Load secrets
  console.log('\nLoading credentials...');
  let secrets: Secrets;
  try {
    secrets = loadSecrets(secretsPath);
    console.log('  Credentials loaded successfully');
  } catch (error) {
    console.error(`\n[ERROR] ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  // Load manifest
  console.log('\nLoading manifest...');
  if (!existsSync(manifestPath)) {
    console.error(`\n[ERROR] Manifest not found: ${manifestPath}`);
    console.error('Run `pnpm preprocess` first to generate the manifest.');
    process.exit(1);
  }

  const manifest: Manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  console.log(`  Found ${manifest.totalEntries} entries to upload`);
  console.log(`  Date range: ${manifest.dateRange.start} to ${manifest.dateRange.end}`);

  if (manifest.totalEntries === 0) {
    console.log('\nNo entries to upload. Exiting.');
    return;
  }

  // Create R2 client
  console.log('\nConnecting to R2...');
  const client = createR2Client(secrets);
  console.log(`  Bucket: ${BUCKET_NAME}`);

  // Upload entries
  console.log(`\nUploading ${manifest.entries.length} journal entries...`);
  const results: UploadResult[] = [];
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < manifest.entries.length; i++) {
    const entry = manifest.entries[i];
    const localPath = join(preprocessedDir, `${entry.date}.md`);

    if (!existsSync(localPath)) {
      console.error(`  [MISS] Local file not found: ${localPath}`);
      results.push({ key: entry.r2Key, success: false, skipped: false, error: 'File not found' });
      failed++;
      continue;
    }

    const content = readFileSync(localPath, 'utf-8');
    const result = await uploadFile(client, entry.r2Key, content, entry.contentHash);
    results.push(result);

    if (result.success) {
      if (result.skipped) {
        skipped++;
      } else {
        uploaded++;
      }
    } else {
      failed++;
      console.error(`  [FAIL] ${entry.r2Key}: ${result.error}`);
    }

    // Progress indicator
    if ((i + 1) % 50 === 0 || i === manifest.entries.length - 1) {
      const pct = Math.round(((i + 1) / manifest.entries.length) * 100);
      console.log(`  Progress: ${i + 1}/${manifest.entries.length} (${pct}%)`);
    }
  }

  // Upload manifest
  console.log('\nUploading manifest...');
  const manifestContent = readFileSync(manifestPath, 'utf-8');
  const manifestResult = await uploadFile(
    client,
    'manifest.json',
    manifestContent,
    manifest.generatedAt, // Use generation timestamp as hash for manifest
    false // Always upload manifest
  );

  if (manifestResult.success) {
    console.log('  Manifest uploaded successfully');
  } else {
    console.error(`  [FAIL] Manifest upload failed: ${manifestResult.error}`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Upload Complete');
  console.log('='.repeat(60));
  console.log(`  Uploaded: ${uploaded}`);
  console.log(`  Skipped (unchanged): ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${manifest.entries.length}`);

  if (failed > 0) {
    console.log('\n[WARNING] Some uploads failed. Review errors above.');
    process.exit(1);
  }

  console.log('\nNext step: Set up Cloudflare infrastructure (Phase 1)');
}

main().catch((error) => {
  console.error('\n[FATAL ERROR]', error);
  process.exit(1);
});
