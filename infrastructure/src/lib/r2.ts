/**
 * R2 Bucket Helpers
 *
 * Utilities for reading/writing to R2 buckets
 */

export async function getObject(
  bucket: R2Bucket,
  key: string
): Promise<string | null> {
  const object = await bucket.get(key);
  if (!object) return null;
  return object.text();
}

export async function putObject(
  bucket: R2Bucket,
  key: string,
  content: string,
  contentType = 'application/json'
): Promise<void> {
  await bucket.put(key, content, {
    httpMetadata: { contentType },
  });
}

export async function listObjects(
  bucket: R2Bucket,
  prefix?: string
): Promise<string[]> {
  const listed = await bucket.list({ prefix });
  return listed.objects.map((obj) => obj.key);
}

export async function deleteObject(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key);
}
