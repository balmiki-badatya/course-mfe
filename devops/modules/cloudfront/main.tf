locals {
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "skillsync_default_oac" {
  name                              = var.oac_name
  origin_access_control_origin_type = var.origin_access_control_origin_type
  signing_behavior                  = var.signing_behavior
  signing_protocol                  = local.signing_protocol
}

resource "aws_cloudfront_distribution" "skillsync_distribution" {
  origin {
    domain_name              = var.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.skillsync_default_oac.id
    origin_id                = var.bucket_origin_id
  }

  enabled             = var.is_distribution_enabled
  is_ipv6_enabled     = var.is_ipv6_enabled
  comment             = var.commnet
  default_root_object = var.default_root_object

  aliases = var.cloudfront_aliases

  default_cache_behavior {
    allowed_methods        = var.allowed_methods
    cached_methods         = var.cached_methods
    target_origin_id       = var.bucket_origin_id
    viewer_protocol_policy = var.viewer_protocol_policy
    cache_policy_id        = var.cache_policy_id
    # min_ttl                = 0            |
    # default_ttl            = 3600         | ----> These 3 are not needed ad the ttls defined in the cache policy will override these values
    # max_ttl                = 86400        |
  }

  price_class = var.cloudfront_price_class
  restrictions {
    geo_restriction {
      restriction_type = "blacklist"
      locations        = ["CN", "TW", "TR", "AF", "PK"]
    }
  }

  tags = merge({ Environment = var.env }, var.default_tags)

  viewer_certificate {
    acm_certificate_arn = var.certificate_arn
    ssl_support_method  = var.ssl_support_method
  }
  wait_for_deployment = var.wait_for_deployment
}