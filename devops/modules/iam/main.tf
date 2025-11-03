data "aws_iam_policy_document" "origin_bucket_policy" {
  statement {
    sid    = var.policy_sid
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = var.s3_permissions

    resources = [
      "${var.aws_s3_bucket_arn}/*",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [var.cloudfront_distribution_arn]
    }
  }
}