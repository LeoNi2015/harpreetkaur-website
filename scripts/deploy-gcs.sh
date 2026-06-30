#!/usr/bin/env bash
# Build and upload static site to Google Cloud Storage.
# Usage: GCS_BUCKET=your-bucket-name ./scripts/deploy-gcs.sh

set -euo pipefail

BUCKET="${GCS_BUCKET:?Set GCS_BUCKET, e.g. export GCS_BUCKET=harpreetkaur-website}"

echo "→ Building static site..."
npm run build

echo "→ Uploading dist/ to gs://${BUCKET}/"
gcloud storage rsync -r --delete-unmatched-destination-objects dist "gs://${BUCKET}"

echo "→ Setting cache headers..."

# HTML: short cache so updates propagate quickly through CDN
gcloud storage objects update "gs://${BUCKET}/index.html" \
  --cache-control="public, max-age=300, must-revalidate"

# Hashed assets (Vite): long immutable cache — safe for CDN
for obj in $(gcloud storage ls "gs://${BUCKET}/assets/**" 2>/dev/null || true); do
  gcloud storage objects update "$obj" \
    --cache-control="public, max-age=31536000, immutable"
done

# Images & static files in bucket root
for obj in $(gcloud storage ls "gs://${BUCKET}/*.png" "gs://${BUCKET}/*.svg" "gs://${BUCKET}/*.jpg" 2>/dev/null || true); do
  gcloud storage objects update "$obj" \
    --cache-control="public, max-age=86400"
done

echo "✓ Deployed to gs://${BUCKET}/"
echo "  If Cloud CDN is configured, invalidate cache after major updates:"
echo "  gcloud compute url-maps invalidate-cdn-cache URL_MAP_NAME --path '/*'"
