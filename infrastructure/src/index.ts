/**
 * Reflections Worker Entry Point
 *
 * This is the main entry point for the Cloudflare Worker.
 * It exports the Durable Object class and handles HTTP requests.
 */

import { ReflectionsCoordinator } from './coordinator';
import { handleExtraction } from './extractor';
import { handleAggregation } from './aggregator';

export { ReflectionsCoordinator };

export interface Env {
  // R2 Buckets
  JOURNALS_BUCKET: R2Bucket;
  OUTPUTS_BUCKET: R2Bucket;

  // D1 Database
  DB: D1Database;

  // KV Cache
  CACHE: KVNamespace;

  // Queues
  EXTRACTION_QUEUE: Queue;
  AGGREGATION_QUEUE: Queue;

  // Durable Objects
  COORDINATOR: DurableObjectNamespace;

  // Secrets (set via wrangler secret)
  OPENROUTER_API_KEY: string;

  // Variables
  ENVIRONMENT: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Route to coordinator for pipeline management
    if (url.pathname.startsWith('/api/')) {
      const id = env.COORDINATOR.idFromName('main');
      const coordinator = env.COORDINATOR.get(id);
      return coordinator.fetch(request);
    }

    return new Response('Reflections Pipeline API', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },

  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {
    // Determine queue type from batch
    // TODO: Implement queue routing based on message metadata
    for (const message of batch.messages) {
      const data = message.body as { type: string };

      if (data.type === 'extraction') {
        await handleExtraction(message, env);
      } else if (data.type === 'aggregation') {
        await handleAggregation(message, env);
      }

      message.ack();
    }
  },
};
