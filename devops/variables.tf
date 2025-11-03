########################################### Default vars ###########################################
variable "application_name" {
  type        = string
  description = "Application name"
}

variable "domain_name" {
  type        = string
  description = "Domain name"
}

variable "created_by" {
  type        = string
  description = "Created by"
}

variable "managed_by" {
  type        = string
  description = "Managed by"
}

variable "region" {
  type        = string
  description = "AWS region, where the resources will be created"
}

# variable "vpc_id" {
#   type        = string
#   description = "VPC id"
# }

variable "env" {
  type        = string
  description = "Environment"

}
#####################################################################################################
########################################### S3 bucet vars ###########################################
variable "s3_bucket_name" {
  type        = string
  description = "S3 bucket name, where the MFE code will be deployed"
}

variable "enable_bucket_versioning" {
  type        = string
  description = "This flag will enable bucket versioning."
}

variable "ownership_ctl" {
  type        = string
  description = "S3 bucket ownership control"
}

variable "acl" {
  type        = string
  description = "Bucket acl"

  validation {
    condition     = contains(["private", "public-read", "public-read-write", "aws-exec-read", "authenticated-read", "bucket-owner-read", "bucket-owner-full-control", "log-delivery-write"], var.acl)
    error_message = "Invalid acl."
  }

}

variable "block_public_acls" {
  type        = bool
  description = "Block public access for s3"
}

variable "block_public_policy" {
  type        = bool
  description = "Block public policy for s3"
}

variable "ignore_public_acls" {
  type        = bool
  description = "Ignore public acls for s3"
}

variable "restrict_public_buckets" {
  type        = bool
  description = "Restrict public buckets for s3"
}

#####################################################################################################
########################################### route53  vars ###########################################

variable "root_domain_name" {
  type        = string
  description = "Root domain name for lookup"
}

variable "is_private_hosted_zone" {
  type        = bool
  description = "Is the root domain provided private?"
}

variable "sub_domain_name" {
  type        = string
  description = "Subdomain which will be created"
}

variable "ns_record_ttl" {
  type        = number
  description = "NS records TTL"
}

#####################################################################################################
###########################################   ACM  vars.  ###########################################

variable "cloudfront_acm_region" {
  type        = string
  description = "Region for cloudfront acm"
}

variable "validation_method" {
  type        = string
  description = "cerificate validation method"
  validation {
    condition     = contains(["DNS", "EMAIL"], var.validation_method)
    error_message = "Invalid certificate validation method."
  }
}

variable "allow_exports" {
  type        = string
  description = "Allow exporting ACM certificate?"
}

variable "key_algorithm" {
  type        = string
  description = "ACM certificate key algorithm."
}
#####################################################################################################
###########################################cloud front vars###########################################

variable "origin_access_control_origin_type" {
  type        = string
  description = "Origin access control origin type"

  validation {
    condition     = contains(["s3", "lambda", "mediapackagev2", "mediastore"], var.origin_access_control_origin_type)
    error_message = "Invalid value origin_access_control_origin_type."

  }
}

variable "signing_behavior" {
  type        = string
  description = "Signin behaviour"

  validation {
    condition     = contains(["always", "never", "no-override"], var.signing_behavior)
    error_message = "Invalid value for signing_behavior"
  }
}

variable "is_distribution_enabled" {
  type        = bool
  description = "Whether the distribution is enabled to accept end user requests for content."
}

variable "is_ipv6_enabled" {
  type        = bool
  description = "Whether the IPv6 is enabled for the distribution."
}

variable "commnet" {
  type        = string
  description = "Cloudfron description"
}

variable "default_root_object" {
  type        = string
  description = "Landing page object"
}

variable "cloudfront_aliases" {
  type        = set(string)
  description = "Alias for cloudfront distribution"
}

variable "allowed_methods" {
  type        = set(string)
  description = "List of Http methods to allow."
}

variable "cached_methods" {
  type        = set(string)
  description = "Set of Http method to cache."
}

variable "viewer_protocol_policy" {
  type        = string
  description = "viewer_protocol_policy"

  validation {
    condition     = contains(["allow-all", "https-only", "redirect-to-https"], var.viewer_protocol_policy)
    error_message = "Invalid value for viewer_protocol_policy"
  }
}

variable "cache_policy_id" {
  type        = string
  description = "cache_policy_id"
}

variable "wait_for_deployment" {
  type        = bool
  description = "Wait for deployment to complete"
}

variable "cloudfront_price_class" {
  type        = string
  description = "Cloudfront price class"
}

variable "ssl_support_method" {
  type        = string
  description = "ssl_support_method"
}

#####################################################################################################
###########################################   IAM  vars.  ###########################################
variable "sid" {
  type        = string
  description = "SID for the cloudfront IAM policy"
}

variable "s3_permissions" {
  type        = set(string)
  description = "S3 Permission set"
}

