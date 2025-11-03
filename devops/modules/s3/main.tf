resource "aws_s3_bucket" "course_mfe_artifact" {
  bucket = var.bucket_configurations.s3_bucket_name
  tags = merge({
    Name = var.bucket_configurations.s3_bucket_name
    },
    var.bucket_configurations.default_tags
  )
}

resource "aws_s3_bucket_ownership_controls" "course_mfe_bucket_ownership_ctl" {
  bucket = aws_s3_bucket.course_mfe_artifact.id

  rule {
    object_ownership = var.bucket_configurations.ownership_ctl
  }
}

resource "aws_s3_bucket_public_access_block" "course_mfe_bucket_access" {
  bucket = aws_s3_bucket.course_mfe_artifact.id

  block_public_acls       = var.bucket_security_configuration.block_public_acls
  block_public_policy     = var.bucket_security_configuration.block_public_policy
  ignore_public_acls      = var.bucket_security_configuration.ignore_public_acls
  restrict_public_buckets = var.bucket_security_configuration.restrict_public_buckets
}

resource "aws_s3_bucket_versioning" "course_mfe_bucket_versioning" {
  bucket = aws_s3_bucket.course_mfe_artifact.id
  versioning_configuration {
    status = var.bucket_configurations.enable_bucket_versioning
  }
}

resource "aws_s3_bucket_policy" "course_mfe_artifact_bucket_policy" {
  bucket = aws_s3_bucket.course_mfe_artifact.bucket
  policy = var.bucket_security_configuration.bucket_policy
}
