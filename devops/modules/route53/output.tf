output "subdomain_details" {
  description = "Subdomain details"
  value = {
    zone_id = aws_route53_zone.skillsync.zone_id
    arn     = aws_route53_zone.skillsync.arn
    NS      = aws_route53_zone.skillsync.name_servers
    SOA     = aws_route53_zone.skillsync.primary_name_server
  }
}
