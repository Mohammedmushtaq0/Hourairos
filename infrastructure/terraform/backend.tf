terraform {
  backend "s3" {
    bucket         = "terraform-state-abhjekdm"
    key            = "terraform-state-files/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "hourairos-terraform-locks"
  }
}