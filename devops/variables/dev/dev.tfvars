application_name = "course-mfe"
region           = "us-west-1"
domain-name      = "skillsync"
created_by       = "Terraform"
managed_by       = "Github-actions"
env              = "dev"
default_region   = "us-west-1"
domain_name      = "skillsync"

######## bucket vars #######
s3_bucket_name           = "course-mfe-build-artifacts"
enable_bucket_versioning = "Enabled"
ownership_ctl            = "BucketOwnerEnforced"
acl                      = "private"
block_public_acls        = true
block_public_policy      = true
ignore_public_acls       = true
restrict_public_buckets  = true

####### sub domain config vars ######
root_domain_name       = "microops.io"
is_private_hosted_zone = false
sub_domain_name        = "skillsync.microops.io"
ns_record_ttl          = 172800

######## ACM config vars ############
cloudfront_acm_region = "us-east-1"
validation_method     = "DNS"
allow_exports         = "DISABLED"
key_algorithm         = "RSA_2048"

######## CloudFront config vars ############
origin_access_control_origin_type = "s3"
signing_behavior                  = "always"
signing_protocol                  = "sigv4"
is_distribution_enabled           = true
is_ipv6_enabled                   = true
commnet                           = "CloudFront distribution for course-mfe dev environment"
default_root_object               = "index.html"
cloudfront_aliases                = ["skillsync.microops.io"]
allowed_methods                   = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
cached_methods                    = ["GET", "HEAD", "OPTIONS"]
viewer_protocol_policy            = "redirect-to-https"
cache_policy_id                   = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
wait_for_deployment               = true
cloudfront_price_class            = "PriceClass_All"
ssl_support_method                = "sni-only"

######## IAM Policy vars ############
sid            = "AllowCloudFrontServiceReadOnlyPrincipal"
s3_permissions = ["s3:GetObject"]

