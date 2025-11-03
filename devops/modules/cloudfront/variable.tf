variable "cloudfront_aliases" {
  type        = set(string)
  description = "Set of aliases for cloudfront distribution."
}

variable "cloudfront_price_class" {
  type        = string
  description = "How many edge location cloudfront will use for caching"
  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.cloudfront_price_class)
    error_message = "Invalid price class"
  }
}

variable "env" {
  type        = string
  description = "Environment type"
}

variable "default_tags" {
  type        = map(string)
  description = "Default_tags"
}

variable "wait_for_deployment" {
  type        = bool
  description = "Wait for cloudfront deployment to be completed"
}

variable "certificate_arn" {
  type        = string
  description = "Certificate arn"
}

variable "bucket_regional_domain_name" {
  type        = string
  description = "S3 bucket regional domain name"
  nullable    = false
}

variable "bucket_origin_id" {
  type        = string
  description = "S3 bucket origin id"
}

variable "is_distribution_enabled" {
  type        = bool
  description = "Whether the distribution is enabled to accept end user requests for content."
  nullable    = false
}

variable "is_ipv6_enabled" {
  type        = bool
  description = "Whether the IPv6 is enabled for the distribution."
}

variable "commnet" {
  type        = string
  description = "Cloud fron distribution comment."
}

variable "default_root_object" {
  type        = string
  description = "Default root object for cloudfront distribution."
}

variable "oac_name" {
  type        = string
  description = "default-oac name"
}

variable "origin_access_control_origin_type" {
  type        = string
  description = "Origin access control origin type"
}

variable "signing_behavior" {
  type        = string
  description = "Signing behavior"
}

variable "ssl_support_method" {
  type        = string
  description = "How you want CloudFront to serve HTTPS requests. One of vip, sni-only, or static-ip."
}

variable "viewer_protocol_policy" {
  type        = string
  description = "Viewer protocol policy"
}

variable "cache_policy_id" {
  type        = string
  description = "Cache policy id for cloud front cache."
}

variable "allowed_methods" {
  type        = set(string)
  description = "Allowed http method for cloudfront"
}

variable "cached_methods" {
  type        = set(string)
  description = "HTTP methods to cache"
}
