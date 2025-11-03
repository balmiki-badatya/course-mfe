output "cloudfront_s3_policy_details" {
  description = "IAM policy details for the cloudfront distribution"
  value       = data.aws_iam_policy_document.origin_bucket_policy.json
}