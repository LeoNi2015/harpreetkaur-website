#!/usr/bin/env bash
# Make GCS bucket publicly readable for direct browser testing (no load balancer).
# Usage: GCS_BUCKET=harpreetkaur-website-prd ./scripts/make-bucket-public.sh

set -euo pipefail

BUCKET="${GCS_BUCKET:?Set GCS_BUCKET, e.g. export GCS_BUCKET=harpreetkaur-website-prd}"

echo "→ Project: $(gcloud config get-value project)"
echo "→ Bucket: gs://${BUCKET}"

echo "→ Disabling public access prevention (if enabled)..."
gcloud storage buckets update "gs://${BUCKET}" --no-public-access-prevention 2>/dev/null || true

echo "→ Allowing public read (allUsers: Storage Object Viewer)..."
gcloud storage buckets add-iam-policy-binding "gs://${BUCKET}" \
  --member=allUsers \
  --role=roles/storage.objectViewer

echo "→ Enabling website index page..."
gcloud storage buckets update "gs://${BUCKET}" \
  --web-main-page-suffix=index.html \
  --web-error-page=index.html

echo "→ Checking index.html exists..."
if ! gcloud storage objects describe "gs://${BUCKET}/index.html" &>/dev/null; then
  echo "✗ index.html not found in bucket. Deploy first:"
  echo "  export GCS_BUCKET=${BUCKET} && ./scripts/deploy-gcs.sh"
  exit 1
fi

echo "→ Testing anonymous access..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://storage.googleapis.com/${BUCKET}/index.html" || true)

if [[ "$HTTP_CODE" == "200" ]]; then
  echo ""
  echo "✓ Bucket is public and index.html is reachable."
else
  echo ""
  echo "⚠ HTTP ${HTTP_CODE} — IAM may take a minute to propagate, or org policy may block public access."
  echo "  Console: https://console.cloud.google.com/storage/browser/${BUCKET};tab=permissions"
  echo "  Confirm principal allUsers has role Storage Object Viewer."
fi

echo ""
echo "Open in browser:"
echo "  https://storage.googleapis.com/${BUCKET}/index.html"
echo "  https://storage.googleapis.com/${BUCKET}/"
echo ""
echo "To revert public access:"
echo "  gcloud storage buckets remove-iam-policy-binding gs://${BUCKET} \\"
echo "    --member=allUsers --role=roles/storage.objectViewer"
