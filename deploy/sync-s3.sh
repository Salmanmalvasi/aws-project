#!/usr/bin/env bash
# ==============================================================================
# IPL Live Analytics — Fast S3 Production Sync Script
# ==============================================================================
set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"
export AWS_PAGER=""

PROFILE="${AWS_PROFILE:-ipl-deploy}"
REGION="${AWS_REGION:-eu-north-1}"
BUCKET="${1:-ipl-live-analytics-748009208411-eu-north-1-production}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "================================================================================"
echo " Syncing IPL Live Analytics Production Build to AWS S3"
echo "================================================================================"
echo " Bucket:   s3://${BUCKET}"
echo " Region:   ${REGION}"
echo " Profile:  ${PROFILE}"
echo "================================================================================"

# 1. Verify AWS Auth
if ! aws sts get-caller-identity --profile "${PROFILE}" > /dev/null 2>&1; then
  echo "⚠️  AWS CLI session expired. Please re-authenticate:"
  echo "    export PATH=\"\$HOME/.local/bin:\$PATH\""
  echo "    aws login --profile ${PROFILE}"
  exit 1
fi

# 2. Build if needed
cd "${ROOT_DIR}"
if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
  echo "Building production frontend with Vite..."
  npm run build
fi

# 3. Sync static assets (without --delete to respect IAM policy)
echo "Syncing assets to S3..."
aws s3 sync dist "s3://${BUCKET}" \
  --profile "${PROFILE}" \
  --region "${REGION}" \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "config.js" \
  --exclude "health.json"

# 4. Copy dynamic entry points without cache
echo "Uploading entrypoints with no-cache headers..."
aws s3 cp dist/index.html "s3://${BUCKET}/index.html" \
  --profile "${PROFILE}" \
  --region "${REGION}" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

aws s3 cp dist/config.js "s3://${BUCKET}/config.js" \
  --profile "${PROFILE}" \
  --region "${REGION}" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "application/javascript"

aws s3 cp dist/health.json "s3://${BUCKET}/health.json" \
  --profile "${PROFILE}" \
  --region "${REGION}" \
  --cache-control "no-cache" \
  --content-type "application/json"

echo "================================================================================"
echo " 🎉 Successfully synced to AWS S3!"
echo " Live Website URL: http://${BUCKET}.s3-website.${REGION}.amazonaws.com/"
echo "================================================================================"
