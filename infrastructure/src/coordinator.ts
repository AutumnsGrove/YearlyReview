/**
 * ReflectionsCoordinator Durable Object
 *
 * Orchestrates the pipeline:
 * - Reads manifest.json from R2
 * - Enqueues extraction jobs
 * - Tracks progress across phases
 * - Triggers aggregation tiers when ready
 */

import type { Env } from './index';

interface PipelineState {
  phase: 'idle' | 'extracting' | 'aggregating' | 'complete';
  totalEntries: number;
  processedEntries: number;
  currentTier: 'weekly' | 'monthly' | 'quarterly' | 'synthesis' | null;
  startedAt: string | null;
  completedAt: string | null;
}

export class ReflectionsCoordinator implements DurableObject {
  private state: DurableObjectState;
  private env: Env;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/api/start':
        return this.startPipeline();

      case '/api/status':
        return this.getStatus();

      case '/api/reset':
        return this.resetPipeline();

      default:
        return new Response('Not Found', { status: 404 });
    }
  }

  private async startPipeline(): Promise<Response> {
    // TODO: Implement pipeline start logic
    // 1. Read manifest.json from R2
    // 2. Enqueue extraction jobs for each entry
    // 3. Update pipeline state

    return new Response(JSON.stringify({ status: 'started' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async getStatus(): Promise<Response> {
    const state = await this.state.storage.get<PipelineState>('pipeline');

    return new Response(JSON.stringify(state || { phase: 'idle' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async resetPipeline(): Promise<Response> {
    await this.state.storage.deleteAll();

    return new Response(JSON.stringify({ status: 'reset' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
