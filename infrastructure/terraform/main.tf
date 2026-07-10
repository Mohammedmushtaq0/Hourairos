# Root module
#
# Infrastructure modules will be added here
# as they are adopted into Terraform.
resource "aws_security_group" "terraform_backend_test" {
  name        = "terraform-backend-test"
  description = "Test security group for Terraform backend"
  vpc_id      = "vpc-08979f731c179b470"

  tags = {
    Name = "terraform-backend-test"
  }
}