#################################
# VPC
#################################

resource "aws_vpc" "hourairos_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "hourairos-vpc"
  }
}

#################################
# Public Subnet 1
#################################

resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.hourairos_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "hourairos-public-1"
  }
}

#################################
# Public Subnet 2
#################################

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.hourairos_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "hourairos-public-2"
  }
}

#################################
# Private Subnet 1
#################################

resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.hourairos_vpc.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "ap-south-1a"

  tags = {
    Name = "hourairos-private-1"
  }
}

#################################
# Private Subnet 2
#################################

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.hourairos_vpc.id
  cidr_block        = "10.0.12.0/24"
  availability_zone = "ap-south-1b"

  tags = {
    Name = "hourairos-private-2"
  }
}

#################################
# Internet Gateway
#################################

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.hourairos_vpc.id

  tags = {
    Name = "hourairos-igw"
  }
}

#################################
# Elastic IP for NAT Gateway
#################################

resource "aws_eip" "nat_eip" {
  domain = "vpc"

  tags = {
    Name = "hourairos-nat-eip"
  }
}

#################################
# NAT Gateway
#################################

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_1.id

  depends_on = [
    aws_internet_gateway.igw
  ]

  tags = {
    Name = "hourairos-nat"
  }
}

#################################
# Public Route Table
#################################

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.hourairos_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "hourairos-public-rt"
  }
}

#################################
# Private Route Table
#################################

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.hourairos_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "hourairos-private-rt"
  }
}

#################################
# Public Route Table Association
#################################

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.public_rt.id
}

#################################
# Private Route Table Association
#################################

resource "aws_route_table_association" "private_1" {
  subnet_id      = aws_subnet.private_1.id
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_route_table_association" "private_2" {
  subnet_id      = aws_subnet.private_2.id
  route_table_id = aws_route_table.private_rt.id
}

#################################
# Public Security Group
#################################

resource "aws_security_group" "public_sg" {
  name        = "hourairos-public-sg"
  description = "Security group for public resources"
  vpc_id      = aws_vpc.hourairos_vpc.id

  # HTTP
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "hourairos-public-sg"
  }
}

#################################
# Private Security Group
#################################

resource "aws_security_group" "private_sg" {
  name        = "hourairos-private-sg"
  description = "Security group for private resources"
  vpc_id      = aws_vpc.hourairos_vpc.id

  # Allow traffic only from Public SG
  ingress {
    description     = "Allow HTTP from Public SG"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.public_sg.id]
  }

  # Allow all traffic within the VPC
  ingress {
    description = "Internal VPC Communication"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"]
  }

  # Outbound internet via NAT
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "hourairos-private-sg"
  }
}