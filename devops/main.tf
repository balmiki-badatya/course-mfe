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
    s3_bucket_name           = var.s3_bucket_name
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
}


