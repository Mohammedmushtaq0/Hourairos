# #################################
# # ECS Cluster
# #################################

# resource "aws_ecs_cluster" "hourairos_cluster" {
#   name = "hourairos-cluster"

#   service_connect_defaults {
#     namespace = aws_service_discovery_http_namespace.hourairos.arn
#   }

#   tags = {
#     Name = "hourairos-cluster"
#   }
# }

# import {
#   to = aws_ecs_cluster.hourairos_cluster
#   id = "hourairos-cluster"
# }