variable "aws_s3_bucket_arn" {
  type        = string
  description = "S3 bucket ARN."
}

variable "cloudfront_distribution_arn" {
  type        = string
  description = "Cloudfront distribution ARN."
}

variable "s3_permissions" {
  type        = set(string)
  description = "Set of permissions to apply on the s3 bucket."
  nullable    = false

  validation {
    condition     = length(var.s3_permissions) >= 1 && contains(var.s3_permissions, "s3:GetObject")
    error_message = "Ivalid input."
  }
}

variable "policy_sid" {
  type        = string
  description = "Policy sid"
  nullable    = false
}