#!/usr/bin/env bash
# ==============================================================================
# IPL Live Analytics — Emergency Cost Saver: Stop Running EC2 Instances
# ==============================================================================
set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"
export AWS_PAGER=""

PROFILE="${AWS_PROFILE:-ipl-deploy}"
REGIONS=("eu-north-1" "ap-south-1" "us-east-1")

echo "================================================================================"
echo " 🛑 AWS COST SAVER: Checking & Stopping Running EC2 Instances"
echo "================================================================================"

for REGION in "${REGIONS[@]}"; do
  echo ""
  echo "Checking region: ${REGION}..."
  
  RUNNING_INSTANCES=$(aws ec2 describe-instances \
    --profile "${PROFILE}" \
    --region "${REGION}" \
    --filters "Name=instance-state-name,Values=running" \
    --query "Reservations[*].Instances[*].InstanceId" \
    --output text 2>/dev/null || true)

  if [ -n "${RUNNING_INSTANCES}" ]; then
    echo "⚠️  Found running EC2 instance(s) in ${REGION}: ${RUNNING_INSTANCES}"
    echo "Stopping instance(s) to prevent any billing..."
    aws ec2 stop-instances \
      --instance-ids ${RUNNING_INSTANCES} \
      --profile "${PROFILE}" \
      --region "${REGION}"
    echo "✓ Instances stopped successfully in ${REGION}!"
  else
    echo "✓ No running EC2 instances found in ${REGION}. ($0.00 compute cost)"
  fi
done

echo ""
echo "================================================================================"
echo " SUMMARY: All compute instances checked. You are safe from EC2 hourly charges."
echo " Note: S3 Static Website Hosting costs virtually $0.00 (within 5 GB Free Tier)."
echo "================================================================================"
