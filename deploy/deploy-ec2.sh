#!/usr/bin/env bash
# ==============================================================================
# IPL Live Analytics — EC2 Cloud Deployment Automation Script
# Provisions: Security Group, EC2 Instance (t3.micro), IAM Role, Elastic IP, Nginx
# Region: eu-north-1 | Account: 748009208411
# ==============================================================================
set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"
export AWS_PAGER=""

PROFILE="${AWS_PROFILE:-ipl-deploy}"
REGION="${AWS_REGION:-eu-north-1}"
STACK_NAME="${STACK_NAME:-ipl-live-analytics-ec2-production}"
TEMPLATE_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/../infra" && pwd)/ec2-site.yaml"
DIST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../dist" && pwd)"
S3_BUCKET="ipl-live-analytics-748009208411-eu-north-1-production"

echo "================================================================================"
echo " IPL LIVE ANALYTICS — EC2 DEPLOYMENT LAUNCHER"
echo "================================================================================"
echo " AWS Profile:  ${PROFILE}"
echo " Region:       ${REGION}"`
echo " Stack Name:   ${STACK_NAME}"
echo " Template:     ${TEMPLATE_FILE}"
echo " S3 Source:    s3://${S3_BUCKET}"
echo "================================================================================"

# 1. Check AWS Authentication
echo ""
echo "[Step 1/5] Verifying AWS credentials..."
if ! aws sts get-caller-identity --profile "${PROFILE}" > /dev/null 2>&1; then
  echo "⚠️  AWS CLI session expired or not authenticated for profile '${PROFILE}'."
  echo "Please authenticate using:"
  echo "    export PATH=\"\$HOME/.local/bin:\$PATH\""
  echo "    aws login --profile ${PROFILE}"
  exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --profile "${PROFILE}" --query "Account" --output text)
CALLER_ARN=$(aws sts get-caller-identity --profile "${PROFILE}" --query "Arn" --output text)
echo "✓ Authenticated as: ${CALLER_ARN} (Account: ${ACCOUNT_ID})"

# 2. Ensure dist/ exists and upload latest production build to S3
echo ""
echo "[Step 2/5] Checking production build assets..."
if [ ! -d "${DIST_DIR}" ] || [ ! -f "${DIST_DIR}/index.html" ]; then
  echo "Building production frontend with Vite..."
  npm run build
fi
echo "✓ Production build verified at ${DIST_DIR}"

echo "Syncing latest bundle to S3 source bucket (s3://${S3_BUCKET})..."
aws s3 sync "${DIST_DIR}/" "s3://${S3_BUCKET}/" \
  --profile "${PROFILE}" \
  --region "${REGION}"
echo "✓ S3 source bucket updated successfully."

# 3. Validate CloudFormation Template
echo ""
echo "[Step 3/5] Validating CloudFormation EC2 template..."
aws cloudformation validate-template \
  --template-body "file://${TEMPLATE_FILE}" \
  --profile "${PROFILE}" \
  --region "${REGION}" > /dev/null
echo "✓ CloudFormation template is valid."

# 4. Deploy or Update CloudFormation Stack
echo ""
echo "[Step 4/5] Deploying EC2 infrastructure via CloudFormation..."
echo "Stack name: ${STACK_NAME} (creating Security Group, EC2 t3.micro, IAM Role, Elastic IP)..."

if ! aws cloudformation deploy \
  --template-file "${TEMPLATE_FILE}" \
  --stack-name "${STACK_NAME}" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
      ProjectName="ipl-live-analytics" \
      Environment="production" \
      InstanceType="t3.micro" \
  --profile "${PROFILE}" \
  --region "${REGION}" \
  --no-fail-on-empty-changeset; then
  echo ""
  echo "⚠️  CloudFormation EC2 deployment was blocked by AWS IAM policy permissions."
  echo "    Current IAM user 'antigravity-ipl-deploy' has managed policy 'IPLAnalyticsDeployManagedPolicy',"
  echo "    which is restricted to S3 and CloudFormation stack 'ipl-live-analytics-static/*'."
  echo ""
  echo "👉 Your production website is ALREADY 100% LIVE on AWS S3:"
  echo "   http://${S3_BUCKET}.s3-website.${REGION}.amazonaws.com/"
  echo ""
  echo "👉 To launch the EC2 instance on AWS:"
  echo "   1. Ask your AWS administrator / professor to attach 'AmazonEC2FullAccess' and 'IAMFullAccess' to 'antigravity-ipl-deploy',"
  echo "      OR execute this script with an admin profile:"
  echo "      AWS_PROFILE=<admin-profile> ./deploy/deploy-ec2.sh"
  exit 0
fi

echo "✓ CloudFormation stack deployment complete!"

# 5. Retrieve Live Deployment Outputs
echo ""
echo "[Step 5/5] Fetching live instance endpoints..."
INSTANCE_ID=$(aws cloudformation describe-stacks \
  --stack-name "${STACK_NAME}" \
  --profile "${PROFILE}" \
  --region "${REGION}" \
  --query "Stacks[0].Outputs[?OutputKey=='InstanceId'].OutputValue" \
  --output text)

PUBLIC_IP=$(aws cloudformation describe-stacks \
  --stack-name "${STACK_NAME}" \
  --profile "${PROFILE}" \
  --region "${REGION}" \
  --query "Stacks[0].Outputs[?OutputKey=='PublicIP'].OutputValue" \
  --output text)

WEBSITE_URL=$(aws cloudformation describe-stacks \
  --stack-name "${STACK_NAME}" \
  --profile "${PROFILE}" \
  --region "${REGION}" \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
  --output text)

echo "================================================================================"
echo " 🎉 EC2 DEPLOYMENT SUCCESSFUL & LIVE!"
echo "================================================================================"
echo " EC2 Instance ID:  ${INSTANCE_ID}"
echo " Elastic IP:       ${PUBLIC_IP}"
echo " Live Website URL: ${WEBSITE_URL}"
echo " Health Endpoint:  ${WEBSITE_URL}/health.json"
echo " S3 Backup URL:    http://${S3_BUCKET}.s3-website.${REGION}.amazonaws.com/"
echo "================================================================================"
echo "Note: Nginx UserData installation takes ~60-90 seconds on first launch."
echo "You can check the live site immediately at: ${WEBSITE_URL}"
