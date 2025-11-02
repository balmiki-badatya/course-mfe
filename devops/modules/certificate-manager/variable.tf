variable "domain_name" {
  type        = string
  description = "Domain name for the certificate"
}

variable "default_tags" {
  type        = map(string)
  description = "Tags for the certificate"
}

variable "certificate_region" {
  type        = string
  description = "Region for the certificate. For cloud front it must be created under us-east-1 region"
}

variable "validation_method" {
  type        = string
  description = "DNS validation method"
}

variable "allow_exports" {
  type        = string
  description = "Allow exporting certificate"
}

variable "key_algorithm" {
  type        = string
  description = "Certificate key algorithm"
}

variable "domain_zone_id" {
  type        = string
  description = "Zone ID where the certificate validation record (CNAME) will get created"
}
