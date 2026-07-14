````markdown
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
