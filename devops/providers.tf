provider "aws" {
}

provider "aws" {
  region = var.cloudfront_acm_region
  alias  = "alias_us_east_1"
}
