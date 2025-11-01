output "certificate_details" {
  description = "Certificate details"
  value = {
    id          = aws_acm_certificate.domain_cert.id
    arn         = aws_acm_certificate.domain_cert.arn
    status      = aws_acm_certificate.domain_cert.status
    domain_name = aws_acm_certificate.domain_cert.domain_name
  }
}
