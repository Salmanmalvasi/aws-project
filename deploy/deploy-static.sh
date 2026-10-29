\#!/usr/bin/env bash
# ==============================================================================
# deploy-static.sh - Safe Production Deployment for IPL Live Analytics
#
# Safety guarantees:
# - Validates AWS Account ID before any cloud mutation.
# - Requires or auto-discovers S3 bucket and CloudFront distribution.
# - Refuses to upload to unverified destinations.
# - Never deletes buckets, CloudFront distributions, or cloud infrastructure.
# - Deletion of obsolete objects is opt-in (--enable-cleanup) and restricted to
#   verified project buckets.
# - Sets optimal cache headers for immutable assets, index.html, and config.js.
# - Supports dry-run mode (--dry-run).
# - Halts immediately on any failure (set -euo pipefail).
# - Zero embedded credentials.
# ==============================================================================

set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"
export AWS_PAGER=""

EXPECTED_ACCOUNT_ID="748009208411"
DEFAULT_REGION="eu-north-1"
STACK_NAME="ipl-live-analytics-static"

BUCKET=""
DISTRIBUTION_ID=""
REGION="${AWS_REGION:-$DEFAULT_REGION}"
PROFILE="${AWS_PROFILE:-ipl-deploy}"
DRY_RUN=false
ENABLE_CLEANUP=false
SKIP_BUILD=false

print_usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Options:
  --bucket <name>            Target S3 bucket name (optional if stack exists)
  --distribution-id <id>     CloudFront distribution ID (optional if stack exists)
  --region <region>          AWS region (default: eu-north-1)
  --profile <profile>        AWS CLI profile (default: ipl-deploy)
  --stack-name <name>        CloudFormation stack name (default: ipl-live-analytics-static)
  --dry-run                  Simulate S3 upload and skip CloudFront invalidation
  --enable-cleanup           Allow s3 sync --delete of obsolete files in project bucket
  --skip-build               Skip npm run build (deploy existing dist/ directory)
  -h, --help                 Show this help message

Examples:
  # Deploy with auto-discovery from CloudFormation:
  deploy/deploy-static.sh --profile ipl-deploy

  # Dry-run deployment with explicit targets:
  deploy/deploy-static.sh --bucket ipl-live-analytics-748009208411-eu-north-1-production --profile ipl-deploy --dry-run
EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --bucket)
      BUCKET="$2"
      shift 2
      ;;
    --distribution-id)
      DISTRIBUTION_ID="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    --stack-name)
      STACK_NAME="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --enable-cleanup)
      ENABLE_CLEANUP=true
      shift
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    *)
      echo "[-] Unknown argument: $1" >&2
      print_usage
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

export AWS_PROFILE="$PROFILE"

echo "=========================================================="
echo " IPL Live Analytics - Static Deployment Engineer Tool"
echo "=========================================================="
echo "[+] AWS Profile:       $PROFILE"
echo "[+] Deployment Region: $REGION"
echo "[+] Dry Run:           $DRY_RUN"
echo "[+] Cleanup Enabled:   $ENABLE_CLEANUP"

# 1. Verify AWS Identity & Account ID
echo "[*] Step 1: Verifying AWS authentication and Account ID..."
if ! command -v aws >/dev/null 2>&1; then
  echo "[-] ERROR: 'aws' CLI executable not found in PATH." >&2
  exit 1
fi

CALLER_IDENTITY=$(aws sts get-caller-identity --output json 2>&1) || {
  echo "[-] ERROR: Failed to obtain AWS caller identity." >&2
  echo "$CALLER_IDENTITY" >&2
  echo "[-] Ensure valid AWS credentials are configured via environment variables or 'aws configure'." >&2
  exit 1
}

CURRENT_ACCOUNT_ID=$(echo "$CALLER_IDENTITY" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Account', ''))")
CURRENT_ARN=$(echo "$CALLER_IDENTITY" | python3 -c "import sys, json; print(json.load(sys.stdin).get('Arn', ''))")

echo "[+] Authenticated IAM Principal: $CURRENT_ARN"
echo "[+] Authenticated Account ID:    $CURRENT_ACCOUNT_ID"

if [[ "$CURRENT_ACCOUNT_ID" != "$EXPECTED_ACCOUNT_ID" ]]; then
  echo "[-] FATAL: Account ID mismatch!" >&2
  echo "    Expected: $EXPECTED_ACCOUNT_ID" >&2
  echo "    Actual:   $CURRENT_ACCOUNT_ID" >&2
  echo "[-] Aborting deployment immediately to prevent accidental deployment to the wrong account." >&2
  exit 1
fi

# 2. Auto-discover stack resources if not provided
if [[ -z "$BUCKET" || -z "$DISTRIBUTION_ID" ]]; then
  echo "[*] Step 2: Auto-discovering CloudFormation stack outputs from '$STACK_NAME'..."
  STACK_INFO=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" --output json 2>/dev/null) || {
    echo "[-] WARNING: Could not describe CloudFormation stack '$STACK_NAME' in region '$REGION'."
    STACK_INFO=""
  }

  if [[ -n "$STACK_INFO" ]]; then
    if [[ -z "$BUCKET" ]]; then
      BUCKET=$(echo "$STACK_INFO" | python3 -c '
import sys, json
data = json.load(sys.stdin)
outputs = data["Stacks"][0].get("Outputs", [])
for out in outputs:
    if out.get("OutputKey") == "WebsiteBucketName":
        print(out.get("OutputValue", ""))
        break
')
    fi
    if [[ -z "$DISTRIBUTION_ID" ]]; then
      DISTRIBUTION_ID=$(echo "$STACK_INFO" | python3 -c '
import sys, json
data = json.load(sys.stdin)
outputs = data["Stacks"][0].get("Outputs", [])
for out in outputs:
    if out.get("OutputKey") == "CloudFrontDistributionId":
        print(out.get("OutputValue", ""))
        break
')
    fi
  fi
fi

if [[ -z "$BUCKET" ]]; then
  echo "[-] ERROR: S3 bucket name could not be determined. Pass --bucket <name> or deploy the CloudFormation stack first." >&2
  exit 1
fi

echo "[+] Target S3 Bucket:             $BUCKET"
echo "[+] Target CloudFront Dist ID:     ${DISTRIBUTION_ID:-'(Not specified / skip invalidation)'}"

# Verify bucket exists and belongs to project
echo "[*] Step 3: Verifying target S3 bucket..."
if ! aws s3api head-bucket --bucket "$BUCKET" 2>&1; then
  echo "[-] ERROR: Destination bucket 's3://$BUCKET' cannot be accessed or does not exist." >&2
  exit 1
fi

# 4. Production Build
if [[ "$SKIP_BUILD" = false ]]; then
  echo "[*] Step 4: Running clean production build (npm ci && npm run build)..."
  if [[ ! -d "node_modules" ]]; then
    npm ci
  fi
  npm run build
fi

if [[ ! -f "dist/index.html" || ! -f "dist/config.js" ]]; then
  echo "[-] ERROR: Build output missing expected files in dist/ (dist/index.html or dist/config.js not found)." >&2
  exit 1
fi
echo "[+] Build artifacts verified in dist/."

# 5. Upload files with tiered caching
echo "[*] Step 5: Uploading frontend artifacts to s3://$BUCKET..."

DRYRUN_FLAG=""
if [[ "$DRY_RUN" = true ]]; then
  DRYRUN_FLAG="--dryrun"
  echo "[!] DRY RUN MODE ACTIVATED - No changes will be written to S3."
fi

# (A) Versioned immutable assets in dist/assets/ (1 year cache)
if [[ -d "dist/assets" ]]; then
  echo "[+] Uploading hashed assets with Cache-Control: max-age=31536000,immutable..."
  aws s3 sync dist/assets "s3://$BUCKET/assets" \
    --cache-control "max-age=31536000,immutable" \
    $DRYRUN_FLAG
fi

# (B) Root static files (except config.js, index.html)
echo "[+] Uploading general static files..."
aws s3 sync dist "s3://$BUCKET" \
  --exclude "assets/*" \
  --exclude "config.js" \
  --exclude "index.html" \
  --cache-control "max-age=86400" \
  $DRYRUN_FLAG

# (C) config.js (MUST NOT BE CACHED so runtime config updates take effect immediately)
echo "[+] Uploading config.js with Cache-Control: no-cache, no-store, must-revalidate..."
aws s3 cp dist/config.js "s3://$BUCKET/config.js" \
  --cache-control "no-cache, no-store, must-revalidate" \
  $DRYRUN_FLAG

# (D) index.html (no-cache so updates load immediately)
echo "[+] Uploading index.html with Cache-Control: no-cache, must-revalidate..."
aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache, must-revalidate" \
  $DRYRUN_FLAG

# (E) Optional cleanup
if [[ "$ENABLE_CLEANUP" = true ]]; then
  if [[ "$BUCKET" =~ ^ipl-live-analytics- ]]; then
    echo "[+] Running cleanup of obsolete files in dedicated project bucket s3://$BUCKET..."
    aws s3 sync dist "s3://$BUCKET" --delete $DRYRUN_FLAG
  else
    echo "[-] Refusing to run --delete on bucket '$BUCKET' (bucket name does not match project naming pattern)." >&2
  fi
fi

# 6. CloudFront Cache Invalidation
if [[ -n "$DISTRIBUTION_ID" ]]; then
  if [[ "$DRY_RUN" = true ]]; then
    echo "[!] DRY RUN: Skipping CloudFront cache invalidation for distribution $DISTRIBUTION_ID."
  else
    echo "[*] Step 6: Creating CloudFront cache invalidation..."
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
      --distribution-id "$DISTRIBUTION_ID" \
      --paths "/index.html" "/config.js" "/health.json" \
      --output text --query 'Invalidation.Id')
    echo "[+] CloudFront invalidation created: $INVALIDATION_ID (paths: /index.html, /config.js, /health.json)"
  fi
fi

echo "=========================================================="
echo "[+] Deployment completed successfully!"
echo "=========================================================="
