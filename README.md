
# Hourairos

> A production-inspired cloud platform for deploying and hosting static websites on AWS using modern cloud-native architecture, Infrastructure as Code, container orchestration, observability, and automated CI/CD.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Why Hourairos?](#why-hourairos)
- [Project Goals](#project-goals)
- [Core Features](#core-features)
- [System Architecture](#system-architecture)
- [Application Workflow](#application-workflow)
- [Authentication Flow](#authentication-flow)
- [Static Website Deployment Flow](#static-website-deployment-flow)
- [Technology Stack](#technology-stack)
- [AWS Services Used](#aws-services-used)
- [Repository Structure](#repository-structure)
- [Backend Architecture](#backend-architecture)
- [Container Architecture](#container-architecture)
- [Amazon ECS Architecture](#amazon-ecs-architecture)
- [Docker Architecture](#docker-architecture)
- [Networking Overview](#networking-overview)
- [Service Discovery using ECS Service Connect](#service-discovery-using-ecs-service-connect)
- [Observability Architecture](#observability-architecture)
- [CI/CD Pipeline](#cicd-pipeline)
- [Infrastructure as Code](#infrastructure-as-code)
- [Terraform Remote State](#terraform-remote-state)
- [Security](#security)
- [Future Improvements](#future-improvements)
- [Learning Outcomes](#learning-outcomes)

---

# Project Overview

Hourairos is a cloud-native static website hosting platform built entirely on AWS.

The project allows authenticated users to upload their static websites in ZIP format, automatically extracts the website, stores it securely inside Amazon S3, and delivers it globally through Amazon CloudFront.

Instead of being a simple CRUD application, Hourairos focuses on demonstrating how modern cloud applications are designed, deployed, monitored, and managed in production environments.

The project combines multiple AWS services with modern DevOps and Cloud Engineering practices, including:

- Containerized applications using Docker
- Amazon ECS with AWS Fargate
- Infrastructure as Code using Terraform
- CI/CD using GitHub Actions
- Authentication using Amazon Cognito
- Distributed observability using OpenTelemetry
- Secure secret management
- Service discovery using ECS Service Connect
- Cloud-native deployment architecture

The primary objective of Hourairos is not only to host static websites but also to serve as a complete cloud engineering project that demonstrates real-world AWS architecture and operational practices.

---

# Why Hourairos?

Most portfolio projects focus only on application development.

Hourairos focuses on the infrastructure behind the application.

Rather than building another full-stack web application, this project explores how cloud providers deploy, manage, monitor, and scale applications in production.

It was built to gain practical experience with AWS services while understanding how these services integrate together to form a complete cloud platform.

The project emphasizes:

- Cloud Architecture
- Infrastructure Automation
- Container Orchestration
- Secure Authentication
- Networking
- Observability
- Continuous Deployment
- Infrastructure as Code

The application itself is intentionally simple so that the primary focus remains on the cloud infrastructure powering it.

---

# Project Goals

The major goals behind this project were:

- Build a production-inspired AWS architecture.
- Learn container orchestration using Amazon ECS.
- Understand Docker image lifecycle.
- Implement Infrastructure as Code using Terraform.
- Learn secure authentication using Amazon Cognito.
- Implement complete observability using OpenTelemetry.
- Understand service-to-service communication inside ECS.
- Deploy applications without managing EC2 servers by using AWS Fargate.
- Build an automated CI/CD pipeline.
- Learn Terraform migration from manually created resources.

---

# Core Features

## User Authentication

- User registration
- Secure login
- Email verification
- Session management
- Cookie-based authentication
- JWT validation through Amazon Cognito

---

## Static Website Hosting

Users can deploy static websites by uploading ZIP files.

Supported website technologies include:

- HTML
- CSS
- JavaScript
- Images
- Fonts
- Static Assets

After uploading, the application automatically:

- Validates the uploaded archive
- Extracts the files
- Finds the project root
- Uploads assets to Amazon S3
- Creates a deployment record
- Makes the website globally accessible through Amazon CloudFront

---

## Cloud Deployment

Every uploaded website receives its own deployment.

Each deployment is isolated from others by storing files inside unique directories.

Example:

deployments/

```
deployment-a83h72/
│
├── index.html
├── css/
├── js/
├── images/
└── assets/
```

This makes deployments immutable and prevents one deployment from affecting another.

---

## Secure Infrastructure

The application makes use of several AWS managed services to improve security.

These include:

- AWS Cognito
- AWS Secrets Manager
- IAM Roles
- IAM Policies
- HTTPS
- CloudFront
- Private networking

Sensitive configuration values are never stored directly inside the source code.

Instead, they are securely retrieved from AWS Secrets Manager during application startup.

---

## Containerized Deployment

The backend application is fully containerized using Docker.

Container images are stored inside Amazon Elastic Container Registry (ECR).

Amazon ECS automatically pulls the latest Docker image from ECR and deploys it using AWS Fargate.

This removes the need to manually manage servers or EC2 instances.

---

## Infrastructure as Code

The infrastructure is managed using Terraform.

Instead of creating infrastructure entirely from scratch, this project demonstrates how existing AWS resources can be migrated into Terraform using Import Blocks.

This closely resembles migration scenarios commonly found in production environments where manually created infrastructure is gradually brought under Infrastructure as Code management.

---

## Complete Observability

Hourairos is instrumented using OpenTelemetry.

The application automatically exports:

- Metrics
- Logs
- Distributed Traces

These telemetry signals are collected by an OpenTelemetry Collector before being forwarded to their respective storage systems.

This architecture separates telemetry generation from telemetry storage.

---

# System Architecture

The overall architecture consists of multiple AWS services working together.

```
                        Internet
                            │
                            │
                     Amazon Route53
                            │
                            │
                  Application Load Balancer
                            │
                            │
                Amazon ECS Cluster (Fargate)
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
         │                                     │
  Hourairos Backend                 OTEL Collector
         │                                     │
         │                                     │
         ├───────────────┐                     │
         │               │                     │
         │               │                     │
      Cognito        Secrets Manager           │
         │                                     │
         │                                     │
         ├───────────────┐                     │
         │               │                     │
         ▼               ▼                     ▼
        S3          CloudFront        Prometheus / Loki / Tempo
         │                                     │
         └─────────────────────────────────────┘
                            │
                        Grafana
```

> Replace this section later with a detailed architecture diagram.

---

# Application Workflow

The complete workflow of Hourairos follows a cloud-native deployment pipeline.

```
User

↓

Authenticate using Cognito

↓

Session Created

↓

Upload ZIP File

↓

Node.js Backend

↓

Validate Archive

↓

Extract Files

↓

Locate index.html

↓

Upload Files to Amazon S3

↓

Generate Deployment ID

↓

Store Deployment Metadata

↓

Serve Website through CloudFront

↓

Website Accessible Globally
```

Each deployment remains independent and can be managed separately.

---

# Authentication Flow

Hourairos uses Amazon Cognito as the Identity Provider.

Instead of implementing a custom authentication system, the project relies on AWS managed authentication services.

Authentication Flow:

```
User

↓

Login Button

↓

Amazon Cognito Hosted UI

↓

Email Verification

↓

Successful Login

↓

Authorization Code

↓

Backend Exchanges Code

↓

Access Token

↓

ID Token

↓

Session Created

↓

Cookie Stored

↓

Authenticated Requests
```

The backend validates every authenticated request before allowing access to protected resources.

Unauthenticated users cannot upload or manage deployments.

---

# Static Website Deployment Flow

Deploying a website involves several independent steps.

## Step 1

The user selects a ZIP archive.

Example:

```
portfolio.zip
```

---

## Step 2

The ZIP archive is uploaded to the backend.

The backend validates:

- File type
- File size
- Upload integrity

---

## Step 3

The archive is extracted.

Example:

```
portfolio/

├── index.html
├── css/
├── js/
├── assets/
└── images/
```

The backend searches recursively until it locates the website root.

---

## Step 4

A unique deployment identifier is generated.

Example:

```
deployment-4df83ad1
```

This deployment ID becomes the root folder inside Amazon S3.

```
deployments/

deployment-4df83ad1/

index.html

css/

js/

images/
```

This structure guarantees deployment isolation and simplifies deployment management.

---

## Step 5

The extracted files are uploaded into Amazon S3.

Amazon S3 serves as durable object storage for all deployment assets.

Benefits include:

- High durability
- High availability
- Virtually unlimited storage
- Managed scalability

S3 stores the static assets while CloudFront handles global content delivery.

---

## Step 6

Amazon CloudFront uses the S3 bucket as its origin.

Instead of exposing S3 directly to end users, CloudFront acts as the content delivery layer.

Benefits include:

- Global edge locations
- Reduced latency
- HTTPS support
- Edge caching
- Improved performance
- Additional security

Every deployment becomes accessible using a CloudFront distribution URL.

Route 53 is used to manage DNS records and custom domains where applicable.

---

## Step 7

Deployment metadata is stored for future management.

Typical metadata includes:

- Deployment ID
- User ID
- Deployment URL
- Upload timestamp
- Deployment status

This enables users to manage multiple website deployments independently.

---

# Technology Stack

| Category | Technologies |
|-----------|-------------|
| Backend | Node.js, Express.js |
| Frontend | HTML, CSS, JavaScript, EJS |
| Authentication | Amazon Cognito |
| Containers | Docker |
| Container Registry | Amazon ECR |
| Container Orchestration | Amazon ECS |
| Compute | AWS Fargate |
| Object Storage | Amazon S3 |
| CDN | Amazon CloudFront |
| DNS | Amazon Route 53 |
| Infrastructure | Terraform |
| Monitoring | OpenTelemetry |
| Metrics | Prometheus |
| Logs | Loki |
| Traces | Tempo |
| Dashboards | Grafana |
| CI/CD | GitHub Actions |
| Version Control | Git & GitHub |

---

# AWS Services Used

| Service | Purpose |
|----------|---------|
| Amazon ECS | Container orchestration |
| AWS Fargate | Serverless container runtime |
| Amazon ECR | Docker image repository |
| Amazon Cognito | Authentication and user management |
| Amazon S3 | Static website storage |
| Amazon CloudFront | Global content delivery |
| Amazon Route 53 | DNS management |
| Application Load Balancer | HTTP traffic routing |
| AWS Secrets Manager | Secure configuration management |
| Amazon CloudWatch | Container logging |
| AWS Cloud Map | Service discovery |
| ECS Service Connect | Service-to-service communication |
| AWS IAM | Access management |
| Amazon VPC | Private networking |
| Terraform | Infrastructure as Code |

---
````
````markdown
# Repository Structure

The repository is organized into multiple components, each responsible for a specific part of the application or infrastructure.

```text
Hourairos/
│
├── backend/
├── infrastructure/
├── observability/
├── public/
├── views/
├── services/
├── utils/
├── middleware/
├── lib/
├── .github/
│   └── workflows/
├── Dockerfile
├── docker-compose.yml
├── bootstrap.js
├── server.js
├── telemetry.js
├── metrics.js
├── package.json
└── README.md
```

The project is intentionally separated into independent modules to improve maintainability and allow infrastructure, application logic, and observability to evolve independently.

---

# Backend Architecture

The backend is built using **Node.js** and **Express.js**.

Rather than acting as a traditional web application, the backend serves as the orchestration layer responsible for authenticating users, processing deployments, communicating with AWS services, and exporting telemetry.

Its responsibilities include:

- User authentication
- Session management
- ZIP upload handling
- Website extraction
- File validation
- Amazon S3 uploads
- Deployment metadata management
- CloudFront URL generation
- Metrics generation
- Trace generation
- Structured logging

The backend remains stateless, allowing multiple ECS tasks to run simultaneously behind the Application Load Balancer.

Because application state is not stored locally, containers can be replaced or restarted without affecting users.

---

# Docker Architecture

The application is packaged as a Docker image before deployment.

Using containers provides several advantages:

- Consistent runtime environments
- Easy deployments
- Dependency isolation
- Versioned application releases
- Faster rollbacks
- Simplified scaling

Every deployment follows the same lifecycle:

```text
Application Source

↓

Docker Build

↓

Docker Image

↓

Amazon ECR

↓

Amazon ECS

↓

AWS Fargate

↓

Running Container
```

Docker ensures the application behaves identically during development, testing, and production.

---

# Amazon ECR

Amazon Elastic Container Registry (ECR) stores all Docker images used by Hourairos.

Whenever the application is updated:

1. A new Docker image is created.
2. The image is tagged.
3. The image is pushed to Amazon ECR.
4. ECS pulls the latest image.
5. A new deployment begins.

This eliminates the need to copy application files directly onto servers.

---

# Amazon ECS Architecture

Amazon ECS serves as the container orchestration platform for Hourairos.

Instead of manually managing Docker containers, ECS automatically handles:

- Task scheduling
- Container placement
- Health monitoring
- Service recovery
- Deployment updates
- Networking
- Service discovery

The project uses the **AWS Fargate launch type**, meaning AWS manages the underlying infrastructure required to run the containers.

No EC2 instances are provisioned or maintained.

Current ECS Services include:

```text
Amazon ECS Cluster

├── Hourairos Application
│
├── OpenTelemetry Collector
│
├── Grafana
│
└── Tempo
```

Each service runs independently inside the cluster while remaining discoverable through ECS Service Connect.

---

# Why AWS Fargate?

Instead of provisioning EC2 instances, Hourairos uses AWS Fargate for container execution.

Advantages include:

- No server management
- Automatic infrastructure provisioning
- Simplified scaling
- Better security isolation
- Pay only for allocated resources
- Reduced operational overhead

Fargate allows the project to focus on application deployment rather than infrastructure maintenance.

---

# Application Load Balancer

All incoming traffic enters the application through an AWS Application Load Balancer.

The ALB performs several responsibilities:

- Receives HTTP/HTTPS requests
- Routes traffic to ECS tasks
- Performs health checks
- Distributes traffic between healthy containers
- Supports future horizontal scaling

High-level request flow:

```text
User

↓

Route 53

↓

Application Load Balancer

↓

Hourairos ECS Tasks
```

Because ECS tasks are ephemeral, the load balancer always routes traffic only to healthy containers.

---

# Networking Overview

The application is deployed inside an Amazon Virtual Private Cloud (VPC).

The networking architecture separates public access from private workloads.

High-level layout:

```text
Internet

↓

Internet Gateway

↓

Public Subnet

↓

Application Load Balancer

↓

Private Subnet

↓

Amazon ECS Tasks
```

This separation improves security by ensuring backend containers are not directly accessible from the public internet.

Networking components include:

- VPC
- Public Subnets
- Private Subnets
- Internet Gateway
- NAT Gateway
- Route Tables
- Security Groups

---

# Service Discovery using ECS Service Connect

One challenge with containerized environments is service-to-service communication.

Containers receive dynamic IP addresses every time they are started.

Hardcoding private IP addresses is therefore not practical.

Hourairos solves this by using **Amazon ECS Service Connect**.

Instead of communicating using IP addresses, services communicate using DNS names.

Example:

```text
Hourairos Backend

↓

otel-collector

↓

tempo
```

If a container is restarted and receives a different private IP address, the DNS name remains unchanged.

This allows services to communicate reliably without requiring configuration updates.

---

# AWS Cloud Map

Service Connect internally uses AWS Cloud Map.

Cloud Map acts as a service registry.

Every ECS service registers itself inside a namespace.

Instead of discovering services through IP addresses, ECS queries Cloud Map.

Example:

```text
Namespace

hourairos.local

↓

Registered Services

hourairos-app

otel-collector

grafana

tempo
```

Cloud Map automatically updates service registrations whenever ECS tasks start or stop.

This provides dynamic service discovery across the cluster.

---

# Internal Service Communication

The backend exports traces, metrics, and logs using OpenTelemetry.

Instead of sending telemetry directly to Prometheus or Tempo, all telemetry is first sent to the OpenTelemetry Collector.

Communication flow:

```text
Hourairos Backend

↓

otel-collector

↓

Prometheus

↓

Grafana
```

Tracing follows a similar path:

```text
Hourairos Backend

↓

otel-collector

↓

Tempo

↓

Grafana
```

This architecture centralizes telemetry collection and allows telemetry backends to be replaced without modifying the application.

---

# Observability Architecture

Modern distributed systems require more than application logs.

Hourairos implements the three pillars of observability:

- Metrics
- Logs
- Traces

These signals provide complete visibility into application behavior.

The application uses OpenTelemetry instrumentation to automatically generate telemetry data.

---

# OpenTelemetry

OpenTelemetry is responsible for collecting telemetry from the backend application.

Automatic instrumentation captures:

- HTTP requests
- Express middleware
- Performance metrics
- Response times
- Errors
- Distributed traces

The backend exports telemetry using the OTLP protocol.

Instead of communicating directly with monitoring tools, telemetry is forwarded to an OpenTelemetry Collector.

---

# OpenTelemetry Collector

The OpenTelemetry Collector serves as the central telemetry gateway.

Responsibilities include:

- Receiving telemetry
- Processing telemetry
- Transforming telemetry
- Exporting telemetry
- Reducing application complexity

Rather than configuring every monitoring system inside the application, only the Collector needs to be configured.

This simplifies maintenance and improves scalability.

---

# Metrics Pipeline

Application metrics follow the pipeline below.

```text
Hourairos Backend

↓

OpenTelemetry SDK

↓

OTEL Collector

↓

Prometheus

↓

Grafana Dashboard
```

Prometheus periodically scrapes exported metrics and stores time-series data.

Grafana visualizes these metrics through customizable dashboards.

---

# Logging Pipeline

Structured application logs follow a different pipeline.

```text
Hourairos Backend

↓

Application Logs

↓

OTEL Collector

↓

Loki

↓

Grafana
```

Loki stores log streams while Grafana provides searching and visualization capabilities.

This separation keeps logs independent from metrics.

---

# Distributed Tracing

Tracing follows the same architecture.

```text
Hourairos Backend

↓

OTEL Collector

↓

Tempo

↓

Grafana
```

Distributed tracing allows developers to understand request execution across multiple services.

Each request receives a unique trace identifier, making it possible to inspect latency and execution paths.

---

# Grafana Dashboards

Grafana acts as the central visualization platform.

Rather than storing telemetry itself, Grafana connects to multiple data sources.

Current data sources include:

- Prometheus
- Loki
- Tempo

This provides a single interface for viewing:

- Infrastructure metrics
- Application metrics
- Logs
- Distributed traces

Using Grafana makes it possible to correlate metrics, logs, and traces from the same request.

---
````
````markdown
# CI/CD Pipeline

Hourairos follows a Git-based development workflow and uses GitHub Actions to automate the application deployment process.

The primary objective of the pipeline is to remove manual deployment steps while ensuring that every deployment follows the same repeatable process.

The CI/CD workflow currently focuses on application deployments. Infrastructure is managed independently through Terraform.

---

## Development Workflow

The project follows a branch-based workflow.

```text
Feature Development

        │

        ▼

     ci-cd Branch

        │

        ▼

 Pull Request Review

        │

        ▼

    Merge to main

        │

        ▼

 GitHub Actions Workflow

        │

        ▼

  Build Docker Image

        │

        ▼

 Push Image to Amazon ECR

        │

        ▼

 Update Amazon ECS Service

        │

        ▼

 New Application Version Running
```

This workflow ensures that deployments only occur after code has been merged into the main branch.

---

## GitHub Actions

GitHub Actions automates the deployment process.

When changes are pushed to the main branch, the workflow performs several tasks automatically.

Typical workflow:

1. Checkout repository.
2. Install project dependencies.
3. Build the Docker image.
4. Authenticate with AWS.
5. Push the Docker image to Amazon ECR.
6. Update the ECS service.
7. ECS starts a new deployment.
8. The Application Load Balancer routes traffic to healthy containers.

This removes the need to manually build images or update ECS after every change.

---

## Authentication using OpenID Connect (OIDC)

One of the security goals of this project was to avoid storing long-lived AWS access keys inside GitHub.

Instead, Hourairos uses GitHub's OpenID Connect (OIDC) integration with AWS IAM.

Authentication flow:

```text
GitHub Actions

↓

Request OIDC Token

↓

AWS IAM Identity Provider

↓

Assume IAM Role

↓

Temporary AWS Credentials

↓

Deploy Resources
```

This approach provides several benefits:

- No AWS access keys stored in GitHub.
- Temporary credentials are generated only during workflow execution.
- Reduced risk of credential leakage.
- Recommended authentication method by AWS.

The GitHub workflow only receives temporary permissions required for deployment.

---

# Infrastructure as Code

Infrastructure is managed using Terraform.

Terraform provides a declarative approach for defining cloud infrastructure.

Instead of manually configuring AWS resources through the AWS Console, infrastructure can be described as code, version controlled, reviewed, and reproduced consistently.

Benefits include:

- Version-controlled infrastructure.
- Repeatable deployments.
- Easier collaboration.
- Reduced configuration drift.
- Automated infrastructure provisioning.
- Easier disaster recovery.

---

# Manual Infrastructure to Terraform Migration

A major objective of this project was to understand how existing cloud environments can be migrated to Infrastructure as Code.

Unlike many tutorials that provision everything directly through Terraform, Hourairos was initially built manually using the AWS Management Console and AWS CLI.

After validating the architecture, the existing infrastructure was gradually imported into Terraform.

Migration process:

```text
AWS Console

↓

Existing AWS Resources

↓

Terraform Resource Blocks

↓

Terraform Import Blocks

↓

Terraform State

↓

Terraform Managed Infrastructure
```

This mirrors a common production scenario where organizations adopt Terraform after infrastructure has already been deployed.

The project demonstrates how manually created AWS resources can become fully managed by Terraform without requiring them to be recreated.

---

# Terraform Import Blocks

Terraform Import Blocks simplify the migration of existing resources.

Instead of using the legacy CLI import command repeatedly, import blocks are defined directly in the Terraform configuration.

Example:

```hcl
resource "aws_ecs_cluster" "hourairos_cluster" {
  name = "hourairos-cluster"
}

import {
  to = aws_ecs_cluster.hourairos_cluster
  id = "hourairos-cluster"
}
```

After importing, Terraform records the resource inside its state file and begins managing it like any other Terraform resource.

This makes the migration process reproducible and keeps import history alongside the infrastructure code.

---

# Terraform Project Structure

The Terraform configuration is organized by service rather than placing every resource inside a single file.

```text
terraform/
│
├── backend.tf
├── providers.tf
├── versions.tf
├── variables.tf
├── outputs.tf
│
├── networking/
│   ├── vpc.tf
│   ├── subnet.tf
│   ├── igw.tf
│   ├── nat.tf
│   ├── route_tables.tf
│   ├── security_groups.tf
│   └── endpoints.tf
│
├── ecs/
│   ├── cluster.tf
│   ├── services.tf
│   ├── task_definitions.tf
│   ├── autoscaling.tf
│   └── cloudmap.tf
│
├── ecr/
├── alb/
├── route53/
├── cloudfront/
├── acm/
├── s3/
├── dynamodb/
├── cognito/
├── iam/
├── secretsmanager/
├── cloudwatch/
├── monitoring/
│   ├── grafana.tf
│   ├── prometheus.tf
│   ├── loki.tf
│   ├── tempo.tf
│   └── otel.tf
├── waf/
├── backup/
├── budgets/
└── security/
```

Organizing resources into dedicated directories improves readability, simplifies maintenance, and makes it easier to locate infrastructure related to a specific AWS service.

---

# Terraform Remote State

The project uses a remote backend to store Terraform state.

State is stored inside an Amazon S3 bucket instead of the local machine.

Architecture:

```text
Terraform

↓

Amazon S3

↓

terraform.tfstate
```

Using remote state provides several advantages:

- Centralized state storage.
- Team collaboration.
- State versioning.
- Backup and recovery.
- Reduced risk of accidental state loss.

---

# State Locking

To prevent multiple Terraform operations from modifying the same infrastructure simultaneously, state locking is used.

The project uses Amazon DynamoDB for Terraform state locking.

Workflow:

```text
terraform apply

↓

Create Lock

↓

Modify Infrastructure

↓

Update State

↓

Release Lock
```

If another Terraform operation starts while the lock exists, Terraform waits until the current operation finishes.

This prevents concurrent state modifications and reduces the risk of state corruption.

---

# Security

Security has been considered throughout the project architecture.

Rather than relying on hardcoded credentials or publicly accessible infrastructure, Hourairos makes use of several AWS security services and best practices.

Key security features include:

- Amazon Cognito authentication.
- Email verification.
- Secure session management.
- Cookie-based authentication.
- IAM Roles.
- IAM Policies.
- AWS Secrets Manager.
- HTTPS endpoints.
- Private networking.
- Security Groups.
- Temporary AWS credentials through OIDC.

---

## Secrets Management

Application secrets are stored in AWS Secrets Manager.

Examples include:

- Cognito configuration.
- Session secrets.
- API credentials.
- Application configuration.

At application startup, the backend retrieves the required configuration securely.

This prevents sensitive information from being committed to Git or embedded inside Docker images.

---

## IAM

AWS Identity and Access Management (IAM) is used to enforce the principle of least privilege.

Separate IAM roles are used for:

- ECS Task Execution
- ECS Task Role
- GitHub Actions Deployment
- Terraform Infrastructure Management

Each role receives only the permissions required for its responsibilities.

---

## Networking Security

The infrastructure is protected using multiple networking controls.

These include:

- Security Groups
- Private Subnets
- Application Load Balancer
- VPC Isolation

Backend containers are not exposed directly to the internet.

External traffic reaches the application only through the Application Load Balancer.

---

# Future Improvements

Although the current implementation demonstrates a complete cloud-native architecture, several enhancements can be added in the future.

Possible improvements include:

- Multi-region deployments.
- Blue/Green deployments.
- Canary deployments.
- Auto Scaling Policies.
- AWS WAF integration.
- Custom deployment domains.
- Deployment rollback support.
- User analytics dashboard.
- Deployment history and versioning.
- Automated SSL certificate provisioning.
- Infrastructure testing.
- Cost monitoring dashboards.
- Backup automation.
- Multi-environment infrastructure (Development, Staging, Production).

---

# Learning Outcomes

Building Hourairos provided practical experience with several cloud engineering concepts beyond simply using AWS services.

Key learning areas include:

- Cloud-native application architecture.
- Containerization using Docker.
- Container orchestration using Amazon ECS.
- Serverless container deployments using AWS Fargate.
- Secure authentication with Amazon Cognito.
- Distributed observability using OpenTelemetry.
- Metrics, logs, and distributed tracing.
- Service discovery using AWS Cloud Map.
- ECS Service Connect networking.
- Infrastructure as Code using Terraform.
- Migration of existing infrastructure into Terraform.
- Remote Terraform state management.
- GitHub Actions CI/CD pipelines.
- Secure AWS authentication using OpenID Connect.
- AWS networking fundamentals.
- Secrets management.
- Infrastructure organization and modularization.

---

# Conclusion

Hourairos was built as a practical cloud engineering project to explore how modern applications are deployed, managed, and monitored on AWS.

Rather than focusing solely on application development, the project emphasizes the infrastructure, automation, networking, observability, and operational practices that support production workloads.

The architecture combines multiple AWS managed services with modern engineering practices to create a scalable, maintainable, and secure deployment platform for static websites.

The project demonstrates the complete lifecycle of a cloud-native application—from user authentication and deployment, through container orchestration, monitoring, continuous deployment, and Infrastructure as Code—while also documenting the migration of manually created AWS resources into Terraform-managed infrastructure.

Although originally developed as a personal learning project, the overall architecture reflects many of the technologies, workflows, and operational concepts commonly used in real-world cloud environments.

---

## Author

**Mohammed Mushtaq**

Cloud Engineer | AWS | Terraform | Docker | Amazon ECS | Infrastructure as Code

GitHub: https://github.com/Mohammedmushtaq0

---

## License

This project is intended for educational and portfolio purposes.

Feel free to explore the codebase, learn from the implementation, and adapt the architecture for your own projects where appropriate.
````
