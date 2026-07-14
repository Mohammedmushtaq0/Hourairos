#################################
# Main Application
#################################

resource "aws_ecr_repository" "main_app" {
  name                 = "hourairos/main-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "hourairos-main-app"
  }
}

#################################
# OTEL Collector
#################################

resource "aws_ecr_repository" "otel_collector" {
  name                 = "hourairos-otel-collector"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "hourairos-otel-collector"
  }
}

#################################
# Tempo
#################################

resource "aws_ecr_repository" "tempo" {
  name                 = "hourairos-tempo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "hourairos-tempo"
  }
}

#################################
# OTEL Collector v2
#################################

resource "aws_ecr_repository" "otel_collector_v2" {
  name                 = "hourairos-otel-collector-v2"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "hourairos-otel-collector-v2"
  }
}


import {
  to = aws_ecr_repository.main_app
  id = "hourairos/main-app"
}

import {
  to = aws_ecr_repository.otel_collector
  id = "hourairos-otel-collector"
}

import {
  to = aws_ecr_repository.tempo
  id = "hourairos-tempo"
}

import {
  to = aws_ecr_repository.otel_collector_v2
  id = "hourairos-otel-collector-v2"
}

resource "aws_ecs_task_definition" "demo_task" {
  family = "demo_task"
  container_definitions = jsonencode([
    {
      name      = "first"
      image     = "service-first"
      cpu       = 10
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    },
    {
      name      = "second"
      image     = "service-second"
      cpu       = 10
      memory    = 256
      essential = true
      portMappings = [
        {
          containerPort = 443
          hostPort      = 443
        }
      ]
    }
  ])

  volume {
    name      = "service-storage"
    host_path = "/ecs/service-storage"
  }

  placement_constraints {
    type       = "memberOf"
    expression = "attribute:ecs.availability-zone in [us-west-2a, us-west-2b]"
  }
}