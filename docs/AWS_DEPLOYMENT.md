# AWS Static Website Deployment Guide: IPL Live Analytics

This document covers the reproducible architecture, deployment procedures, security controls, troubleshooting, and teardown instructions for hosting the **IPL Live Analytics Platform** frontend on AWS.

---

## 1. Deployed Architecture

```
                                    +-----------------------+
                                    |    End User Browser   |
                                    +-----------+-----------+
                                                |
                                        HTTPS (TLS 1.2/1.3)
                                                v
                                 +-----------------------------+
                                 |    Amazon CloudFront        |
                                 |  Global CDN Distribution    |
                                 +--------------+--------------+
                                                |
                                       Origin Access Control
                                         (SigV4 Signed)
                                                v
                                 +-----------------------------+
                                 |       Amazon S3 Bucket      |
                                 | (Block Public Access: TRUE) |
                                 | (SSE-AES256 Encrypted)      |
                                 +-----------------------------+
```

### Components
1. **Amazon S3**:
   - Stores the compiled static frontend files (`dist/`).
   - Private bucket with **S3 Block Public Access** enabled across all 4 controls.
   - Bucket policy restricts `s3:GetObject` solely to the CloudFront distribution via **Origin Access Control (OAC)**.
   - Server-Side Encryption enabled by default (`AES256`).
2. **Amazon CloudFront**:
   - Serves as the public HTTPS entry point using the default CloudFront domain.
   - Enforces HTTPS redirection (`redirect-to-https`).
   - Uses **Origin Access Control (OAC)** with AWS Signature Version 4 (SigV4) to authenticate requests to the private S3 REST endpoint.
   - Single Page Application (SPA) routing: Custom error responses route 403 and 404 to `/index.html` with HTTP 200.
   - Dedicated cache behaviors:
     - `/assets/*`: Managed `CachingOptimized` (`max-age=31536000,immutable`).
     - `config.js`: Managed `CachingDisabled` to allow immediate runtime configuration changes without rebuilding.
     - `health.json`: Managed `CachingDisabled`.
3. **AWS CloudFormation**:
   - Infrastructure-as-Code template: `infra/static-site.yaml`.
   - Defines the S3 bucket, CloudFront OAC, Distribution, and S3 Bucket Policy as a single atomic stack.

---

## 2. Resource Inventory & Configuration

| Property | Value |
|---|---|
| **AWS Account ID** | `748009208411` |
| **CloudFormation Region** | `eu-north-1` (Europe Stockholm) |
| **CloudFormation Stack Name** | `ipl-live-analytics-static` |
| **Infrastructure Template** | `infra/static-site.yaml` |
| **S3 Bucket Name Pattern** | `ipl-live-analytics-748009208411-eu-north-1-production` |
| **Origin Access Control** | `AWS::CloudFront::OriginAccessControl` (SigV4, s3 origin) |
| **CloudFront Pricing Tier** | PriceClass_100 (North America & Europe) |
| **Deployment Script** | `deploy/deploy-static.sh` |

---

## 3. Least-Privilege IAM Policy for Deployment

To deploy and maintain this infrastructure without granting `AdministratorAccess`, attach the following least-privilege IAM policy to the deployment principal (e.g. `antigravity-ipl-deploy`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "STSIdentityVerification",
      "Effect": "Allow",
      "Action": [
        "sts:GetCallerIdentity"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFormationLifecycle",
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:DescribeStackResources",
        "cloudformation:GetTemplate",
        "cloudformation:ValidateTemplate",
        "cloudformation:CreateChangeSet",
        "cloudformation:ExecuteChangeSet",
        "cloudformation:DescribeChangeSet",
        "cloudformation:DeleteChangeSet"
      ],
      "Resource": "arn:aws:cloudformation:eu-north-1:748009208411:stack/ipl-live-analytics-static/*"
    },
    {
      "Sid": "S3BucketAndPolicyManagement",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:PutBucketPolicy",
        "s3:GetBucketPolicy",
        "s3:DeleteBucketPolicy",
        "s3:PutBucketEncryption",
        "s3:GetBucketEncryption",
        "s3:PutBucketPublicAccessBlock",
        "s3:GetBucketPublicAccessBlock",
        "s3:PutBucketTagging",
        "s3:GetBucketTagging"
      ],
      "Resource": "arn:aws:s3:::ipl-live-analytics-748009208411-eu-north-1-production"
    },
    {
      "Sid": "S3ObjectSyncManagement",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::ipl-live-analytics-748009208411-eu-north-1-production",
        "arn:aws:s3:::ipl-live-analytics-748009208411-eu-north-1-production/*"
      ]
    },
    {
      "Sid": "CloudFrontDistributionManagement",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateDistribution",
        "cloudfront:UpdateDistribution",
        "cloudfront:DeleteDistribution",
        "cloudfront:GetDistribution",
        "cloudfront:GetDistributionConfig",
        "cloudfront:CreateOriginAccessControl",
        "cloudfront:GetOriginAccessControl",
        "cloudfront:DeleteOriginAccessControl",
        "cloudfront:UpdateOriginAccessControl",
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:TagResource",
        "cloudfront:UntagResource",
        "cloudfront:ListTagsForResource"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 4. Deployment Instructions

### Prerequisites
1. Ensure the AWS CLI is configured with credentials for Account `748009208411`:
   ```bash
   aws configure
   # Set AWS Access Key ID, Secret Access Key, and default region: eu-north-1
   ```
2. Confirm identity:
   ```bash
   aws sts get-caller-identity
   ```

### Step 1: Deploy Infrastructure with CloudFormation
Deploy the template in `eu-north-1`:
```bash
aws cloudformation deploy \
  --template-file infra/static-site.yaml \
  --stack-name ipl-live-analytics-static \
  --region eu-north-1 \
  --parameter-overrides Environment=production ProjectName=ipl-live-analytics
```

To view stack outputs:
```bash
aws cloudformation describe-stacks \
  --stack-name ipl-live-analytics-static \
  --region eu-north-1 \
  --query 'Stacks[0].Outputs' \
  --output table
```

### Step 2: Build and Deploy the Frontend
Run the safe deployment engineer script:
```bash
# Auto-discovers bucket and distribution from CloudFormation stack:
deploy/deploy-static.sh

# Or run in dry-run mode first to preview operations:
deploy/deploy-static.sh --dry-run
```

---

## 5. Cache Invalidation & Updates

- **Automatic Invalidation**: `deploy/deploy-static.sh` automatically invalidates `/index.html`, `/config.js`, and `/health.json` after every upload.
- **Manual Invalidation**: To force an immediate purge across CloudFront:
  ```bash
  aws cloudfront create-invalidation \
    --distribution-id <DISTRIBUTION_ID> \
    --paths "/*"
  ```
- **Runtime Configuration Updates**:
  If the backend endpoint changes in the future, simply update `dist/config.js` and copy it to S3:
  ```bash
  aws s3 cp public/config.js s3://<BUCKET_NAME>/config.js --cache-control "no-cache, no-store, must-revalidate"
  aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/config.js"
  ```

---

## 6. Troubleshooting

1. **HTTP 403 Forbidden on CloudFront URL**:
   - Verify the S3 bucket policy allows `cloudfront.amazonaws.com` with `AWS:SourceArn` matching the CloudFront distribution ARN.
   - Check that `OriginAccessControlId` is properly set on the CloudFront origin and `OriginAccessIdentity` is empty (`""`).
2. **Missing Assets or Blank Screen**:
   - Verify that Vite built with relative base paths (`base: './'` or root relative).
   - Check the browser DevTools Console and Network tabs for 404s.
3. **Old Content Cached**:
   - Ensure `deploy/deploy-static.sh` completed invalidation.
   - Check cache headers with:
     ```bash
     curl -I https://<CLOUDFRONT_DOMAIN>/index.html
     ```

---

## 7. Cost Drivers & Optimization

- **Amazon S3**:
  - Storage: < 10 MB for frontend assets (~$0.0002/month).
  - API requests: Standard `PUT` and `GET` requests during deployment.
- **Amazon CloudFront**:
  - Free Tier includes 1 TB of data transfer out per month and 10,000,000 HTTP/HTTPS requests indefinitely.
  - PriceClass_100 is selected (serves from US and Europe edge locations, lowest cost tier).
- **Origin Access Control & CloudFormation**: Free of charge.

---

## 8. Safe Teardown Instructions

If you ever wish to decommission the website:

1. **Empty the S3 bucket** (CloudFormation will fail to delete a non-empty bucket):
   ```bash
   aws s3 rm s3://<BUCKET_NAME> --recursive
   ```
2. **Delete the CloudFormation Stack**:
   ```bash
   aws cloudformation delete-stack \
     --stack-name ipl-live-analytics-static \
     --region eu-north-1
   ```
3. **Consequences**:
   - The CloudFront distribution will be disabled and deleted.
   - The public HTTPS URL will become permanently inaccessible.
   - The private S3 bucket will be deleted.
   - No ongoing AWS charges will be incurred.

---

## 9. Direct S3 Static Website Hosting (Direct / Fallback Mode)

When CloudFront distribution creation is blocked due to account verification or organization restrictions, the application can be hosted directly via Amazon S3 Static Website Hosting as an immediate solution.

### Architecture Comparison

| Feature | Production Mode (CloudFront + S3 OAC) | Direct Mode (S3 Static Website Hosting) |
|---|---|---|
| **Entrypoint** | CloudFront CDN Distribution | Regional S3 Website Endpoint |
| **Protocol** | **HTTPS (TLS 1.2/1.3)** | **HTTP only** (S3 website endpoints do not support custom SSL) |
| **Bucket Access** | Fully Private (All 4 BPA controls ON) | Bucket Policy allows anonymous `s3:GetObject` |
| **Edge Caching** | Global edge cache (CloudFront) | Origin-only (S3 regional endpoint in `eu-north-1`) |
| **Endpoint URL** | `https://<distribution-id>.cloudfront.net` | `http://<bucket-name>.s3-website.<region>.amazonaws.com` |

### Important HTTP-Only Security Limitation
Amazon S3 static website hosting endpoints only operate over **HTTP**. They do **not** support HTTPS with custom or default SSL certificates.
- Browsers will flag the connection as "Not Secure" (HTTP).
- All published frontend assets (`index.html`, JavaScript, CSS) are publicly readable by design.
- Never place secrets, credentials, `.env` files, or proprietary backend keys in frontend public assets.

### IAM Permissions Required
To manage static website hosting, the deployer policy (`IPLAnalyticsDeployManagedPolicy`) attached to `IPLAnalyticsDeployers` must include:

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutBucketWebsite",
    "s3:GetBucketWebsite"
  ],
  "Resource": "arn:aws:s3:::ipl-live-analytics-748009208411-eu-north-1-production"
}
```

> **Note on Blocker**: If `s3:PutBucketWebsite` is not present in the IAM policy, attempts to configure website hosting will return `AccessDenied` and the regional website endpoint will return `404 NoSuchWebsiteConfiguration`. Authorization must be granted by an IAM administrator; deployers must not attempt privilege escalation.

### Deployment Procedure

1. **Configure S3 Public Access Settings (Bucket Level)**:
   Keep ACLs blocked, but permit public bucket policies:
   ```bash
   aws s3api put-public-access-block \
     --bucket ipl-live-analytics-748009208411-eu-north-1-production \
     --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
     --profile ipl-deploy
   ```

2. **Attach Scoped Public-Read Bucket Policy**:
   Grant read-only access strictly to objects in this project bucket:
   ```bash
   aws s3api put-bucket-policy \
     --bucket ipl-live-analytics-748009208411-eu-north-1-production \
     --policy '{"Version":"2012-10-17","Statement":[{"Sid":"PublicReadGetObject","Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::ipl-live-analytics-748009208411-eu-north-1-production/*"}]}' \
     --profile ipl-deploy
   ```

3. **Enable Static Website Hosting**:
   ```bash
   aws s3api put-bucket-website \
     --bucket ipl-live-analytics-748009208411-eu-north-1-production \
     --website-configuration '{"IndexDocument":{"Suffix":"index.html"}}' \
     --profile ipl-deploy
   ```

4. **Build and Upload Static Assets**:
   ```bash
   npm ci
   npm run build
   aws s3 sync dist/ s3://ipl-live-analytics-748009208411-eu-north-1-production/ --profile ipl-deploy
   ```

5. **Endpoint Verification**:
   - Regional Website URL: `http://ipl-live-analytics-748009208411-eu-north-1-production.s3-website.eu-north-1.amazonaws.com`
   - Direct Object REST URL: `https://ipl-live-analytics-748009208411-eu-north-1-production.s3.eu-north-1.amazonaws.com/index.html`

