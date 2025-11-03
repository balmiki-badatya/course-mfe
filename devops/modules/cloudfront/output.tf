output "couldfront_distribution_details" {
  description = "Cloudfront description details"
  value = {
    id             = aws_cloudfront_distribution.skillsync_distribution.id
    arn            = aws_cloudfront_distribution.skillsync_distribution.arn
    status         = aws_cloudfront_distribution.skillsync_distribution.status
    domain_name    = aws_cloudfront_distribution.skillsync_distribution.domain_name
    hosted_zone_id = aws_cloudfront_distribution.skillsync_distribution.hosted_zone_id
  }
}