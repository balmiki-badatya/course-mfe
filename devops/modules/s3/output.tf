output "course_mfe_s3_bucket_details" {
  description = "S3 bucket name"
  value = {
    bucket_id = aws_s3_bucket.course_mfe_artifact.id,
    arn       = aws_s3_bucket.course_mfe_artifact.arn
  }
}
