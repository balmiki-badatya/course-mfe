variable "bucket_configurations" {
  type = object({
    s3_bucket_name           = string
    default_tags             = map(string)
    enable_bucket_versioning = string
    acl                      = optional(string, "private")
    ownership_ctl            = string
  })
  validation {
    condition     = contains(["BucketOwnerPreferred", "ObjectWriter", "BucketOwnerEnforced"], var.bucket_configurations.ownership_ctl)
    error_message = "Invalid bucket ownership control must one of these [BucketOwnerPreferred, ObjectWriter, BucketOwnerEnforced]"
  }
  description = "S3 bucket basic config details"
}

variable "bucket_security_configuration" {
  type = object({
    block_public_acls       = bool
    block_public_policy     = bool
    ignore_public_acls      = bool
    restrict_public_buckets = bool
    bucket_policy           = string
  })
  description = "Access flags for the s3."
}
