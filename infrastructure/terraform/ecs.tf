#################################
# ECS Cluster
#################################

resource "aws_ecs_cluster" "hourairos_cluster" {
  name = "hourairos-cluster"

  service_connect_defaults {
    namespace = aws_service_discovery_http_namespace.hourairos.arn
  }

  tags = {
    Name = "hourairos-cluster"
  }
}

import {
  to = aws_ecs_cluster.hourairos_cluster
  id = "hourairos-cluster"
}

#################################
# ECS Services
#################################

resource "aws_ecs_service" "hourairos_app" {
  name    = "hourairous-app-fargate-service-z4p2puiy"
  cluster = aws_ecs_cluster.hourairos_cluster.id
}

import {
  to = aws_ecs_service.hourairos_app
  id = "hourairos-cluster/hourairous-app-fargate-service-z4p2puiy"
}


resource "aws_ecs_service" "grafana" {
  name    = "hourairos-grafana-service-hsihj5bd"
  cluster = aws_ecs_cluster.hourairos_cluster.id
}

import {
  to = aws_ecs_service.grafana
  id = "hourairos-cluster/hourairos-grafana-service-hsihj5bd"
}


resource "aws_ecs_service" "tempo" {
  name    = "hourairos-tempo--service-c681eq7s"
  cluster = aws_ecs_cluster.hourairos_cluster.id
}

import {
  to = aws_ecs_service.tempo
  id = "hourairos-cluster/hourairos-tempo--service-c681eq7s"
}


resource "aws_ecs_service" "otel_collector" {
  name    = "hourairos-otel-collector-service-291tugr6"
  cluster = aws_ecs_cluster.hourairos_cluster.id
}

import {
  to = aws_ecs_service.otel_collector
  id = "hourairos-cluster/hourairos-otel-collector-service-291tugr6"
}