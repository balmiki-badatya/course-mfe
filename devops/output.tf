output "s3_details" {
  description = "S3 bucket details"
  value       = module.s3.course_mfe_s3_bucket_details
}

output "sub_domain_details" {
  description = "SkillSync sub domain details"
  value       = module.roue53.subdomain_details
}

output "cloudfront_certificate_details" {
  description = "Cloudfront ACM certificate details"
  value       = module.acm.certificate_details
}
