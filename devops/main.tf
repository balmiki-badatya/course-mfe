locals {

  default_tags = {
    created_by = var.application_name,
    domain     = var.domain_name,
    created_by = var.created_by,
    managed_by = var.managed_by,
    region     = var.region
  }

}

data "aws_route53_zone" "root_domain" {
  name         = var.root_domain_name
  private_zone = var.is_private_hosted_zone
}

module "s3" {
  source = "./modules/s3"
  bucket_configurations = {
    s3_bucket_name           = "${var.s3_bucket_name}-${var.region}"
    default_tags             = local.default_tags
    enable_bucket_versioning = var.enable_bucket_versioning
    acl                      = var.acl
    ownership_ctl            = var.ownership_ctl
  }
  bucket_security_configuration = {
    block_public_acls       = var.block_public_acls
    block_public_policy     = var.block_public_policy
    ignore_public_acls      = var.ignore_public_acls
    restrict_public_buckets = var.restrict_public_buckets
    bucket_policy           = module.iam.cloudfront_s3_policy_details
  }
}

# Create domain for course MFE as this is entry point. It will be root for SkillSync
module "roue53" {
  source              = "./modules/route53"
  root_domain_zone_id = data.aws_route53_zone.root_domain.zone_id
  sub_domain_name     = var.sub_domain_name
  default_tags        = local.default_tags
  ns_record_ttl       = var.ns_record_ttl
}

# Create certificate for cloud front distribution course mfe

module "acm" {
  source             = "./modules/certificate-manager"
  default_tags       = local.default_tags
  certificate_region = var.cloudfront_acm_region
  domain_name        = "*.${var.sub_domain_name}"
  validation_method  = var.validation_method
  allow_exports      = var.allow_exports
  key_algorithm      = var.key_algorithm
  domain_zone_id     = module.roue53.subdomain_details.zone_id
  providers = {
    aws = aws.alias_us_east_1
  }
}

# Create cloudfront distribution 

module "cloudfront" {
  source                            = "./modules/cloudfront"
  env                               = var.env
  default_tags                      = local.default_tags
  oac_name                          = "${var.s3_bucket_name}-cloudfront-distribution-oac"
  origin_access_control_origin_type = var.origin_access_control_origin_type
  signing_behavior                  = var.signing_behavior
  bucket_regional_domain_name       = module.s3.course_mfe_s3_bucket_details.bucket_regional_domain_name
  bucket_origin_id                  = module.s3.course_mfe_s3_bucket_details.bucket_id
  is_distribution_enabled           = var.is_distribution_enabled
  is_ipv6_enabled                   = var.is_ipv6_enabled
  commnet                           = var.commnet
  default_root_object               = var.default_root_object
  cloudfront_aliases                = var.cloudfront_aliases
  allowed_methods                   = var.allowed_methods
  cached_methods                    = var.cached_methods
  viewer_protocol_policy            = var.viewer_protocol_policy
  cache_policy_id                   = var.cache_policy_id
  certificate_arn                   = module.acm.certificate_details.arn
  wait_for_deployment               = var.wait_for_deployment
  cloudfront_price_class            = var.cloudfront_price_class
  ssl_support_method                = var.ssl_support_method
  depends_on                        = [module.acm]
}

module "iam" {
  source                      = "./modules/iam"
  policy_sid                  = var.sid
  s3_permissions              = var.s3_permissions
  cloudfront_distribution_arn = module.cloudfront.couldfront_distribution_details.arn
  aws_s3_bucket_arn           = module.s3.course_mfe_s3_bucket_details.arn
}