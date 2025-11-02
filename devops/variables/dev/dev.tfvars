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


