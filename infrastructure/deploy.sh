#!/bin/bash
set -e

echo "========================================"
echo "  Reflections Infrastructure Deployment"
echo "========================================"
echo ""

echo "Creating R2 buckets..."
wrangler r2 bucket create reflections-journals || echo "Bucket may already exist"
wrangler r2 bucket create reflections-outputs || echo "Bucket may already exist"

echo ""
echo "Creating D1 database..."
wrangler d1 create reflections || echo "Database may already exist"

echo ""
echo "Applying D1 schema..."
wrangler d1 execute reflections --file=schema.sql

echo ""
echo "Creating KV namespace..."
wrangler kv:namespace create CACHE || echo "Namespace may already exist"

echo ""
echo "Creating Queues..."
wrangler queues create extraction-queue || echo "Queue may already exist"
wrangler queues create aggregation-queue || echo "Queue may already exist"
wrangler queues create extraction-dlq || echo "Queue may already exist"
wrangler queues create aggregation-dlq || echo "Queue may already exist"

echo ""
echo "Deploying workers..."
wrangler deploy

echo ""
echo "========================================"
echo "  Deployment Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Update wrangler.toml with D1 database_id and KV namespace id"
echo "  2. Set secrets: wrangler secret put OPENROUTER_API_KEY"
echo "  3. Run 'pnpm preprocess' to prepare journal entries"
echo "  4. Run 'pnpm upload' to upload to R2"
