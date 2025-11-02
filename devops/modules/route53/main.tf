resource "aws_route53_zone" "skillsync" {
  name = var.sub_domain_name
  tags = merge(
    var.default_tags
  )
}

resource "aws_route53_record" "skillsync-ns" {
  zone_id = var.root_domain_zone_id
  name    = var.sub_domain_name
  type    = "NS"
  ttl     = var.ns_record_ttl
  records = aws_route53_zone.skillsync.name_servers
}
