# Hourairos

> **A production-inspired cloud-native static website hosting platform built on AWS using Amazon ECS, AWS Fargate, Terraform, OpenTelemetry, and GitHub Actions.**

---

<p align="center">

**Build • Deploy • Observe • Automate**

A complete cloud engineering project demonstrating modern AWS architecture, Infrastructure as Code, container orchestration, observability, secure authentication, and production deployment practices.

</p>

---

> **This project was built to learn cloud engineering, not just cloud services.**
>
> Instead of creating another CRUD application, Hourairos focuses on understanding how production applications are deployed, managed, monitored, secured, and automated on AWS.

---

# TL;DR (30 Second Overview)

Hourairos is a cloud-native platform that allows authenticated users to deploy static websites by uploading a ZIP archive.

After a user uploads their project, the backend automatically validates the archive, extracts its contents, uploads the website to Amazon S3, and serves it globally through Amazon CloudFront.

The application itself is fully containerized using Docker and deployed on Amazon ECS using the AWS Fargate launch type. Authentication is handled through Amazon Cognito while infrastructure is managed using Terraform.

The platform also includes a complete observability stack powered by OpenTelemetry, Prometheus, Grafana, Tempo and Loki, allowing metrics, logs and distributed traces to be collected from the application.

Instead of relying on manually deployed infrastructure, the project demonstrates how existing AWS resources can be migrated into Terraform using Import Blocks while maintaining infrastructure state remotely using Amazon S3 and DynamoDB.

The complete application lifecycle—from source code to production deployment—is automated using GitHub Actions with AWS OpenID Connect (OIDC), eliminating the need for long-lived AWS credentials.

---

# Highlights

* Production-inspired AWS architecture
* Static website deployment platform
* Containerized Node.js backend
* Amazon ECS with AWS Fargate
* Docker & Amazon ECR
* Amazon Cognito authentication
* ZIP based deployment workflow
* Amazon S3 static asset hosting
* Amazon CloudFront global CDN
* Amazon Route 53 DNS management
* ECS Service Connect
* AWS Cloud Map service discovery
* OpenTelemetry instrumentation
* Prometheus metrics
* Loki log aggregation
* Tempo distributed tracing
* Grafana dashboards
* Infrastructure as Code using Terraform
* Terraform Import Blocks
* Remote Terraform state using Amazon S3
* DynamoDB state locking
* GitHub Actions CI/CD
* AWS OpenID Connect authentication

---

# What is Hourairos?

Hourairos is a cloud-native static website hosting platform designed to simulate the deployment workflow used by modern hosting providers such as Vercel and Netlify while exposing the underlying cloud infrastructure powering those deployments.

Instead of focusing primarily on frontend or backend application development, this project focuses on the cloud engineering practices required to deploy and operate applications at scale.

The platform demonstrates how multiple AWS managed services integrate together to provide authentication, deployment automation, networking, observability, infrastructure management and continuous delivery.

Hourairos was developed as a learning project to gain practical experience with modern AWS architecture while implementing production-inspired engineering practices rather than relying on simplified tutorial examples.

---

# Why I Built Hourairos

Most portfolio projects demonstrate application development.

Hourairos was built to demonstrate cloud engineering.

The objective was not simply to deploy an application but to understand every layer involved in operating cloud-native workloads.

Throughout the project I wanted to answer questions such as:

* How do containerized applications communicate inside ECS?
* How does AWS Fargate remove server management?
* How does Service Connect discover services?
* How are distributed traces collected?
* How do production applications manage secrets?
* How does Terraform migrate existing infrastructure?
* How do GitHub Actions securely authenticate with AWS?
* How do monitoring systems collect telemetry from distributed services?

Rather than studying these concepts individually, Hourairos combines them into one complete project where every service works together as part of a production-inspired architecture.

---

# What Makes Hourairos Different?

Many AWS portfolio projects follow a similar pattern:

* Launch an EC2 instance
* Deploy a web application
* Connect a database
* Stop

Hourairos takes a different approach.

Instead of demonstrating individual AWS services, it focuses on how cloud platforms are engineered.

Some of the engineering concepts demonstrated include:

## Cloud Native Deployment

The application is deployed entirely as containers using Amazon ECS and AWS Fargate without managing EC2 instances.

---

## Infrastructure as Code Migration

Rather than provisioning infrastructure exclusively through Terraform, the project demonstrates migrating manually created AWS resources into Terraform using Import Blocks.

This reflects a common real-world scenario where organizations adopt Infrastructure as Code after infrastructure has already been deployed.

---

## Service-to-Service Communication

Instead of relying on static IP addresses, ECS Service Connect and AWS Cloud Map provide dynamic service discovery between application components.

---

## Complete Observability

The backend exports metrics, logs and traces through OpenTelemetry.

Telemetry is collected by an OpenTelemetry Collector before being forwarded to Prometheus, Loki and Tempo for storage and visualization inside Grafana.

---

## Secure Deployment Pipeline

GitHub Actions authenticates to AWS using OpenID Connect.

No long-lived AWS credentials are stored inside GitHub.

Temporary credentials are issued dynamically during every deployment.

---

## Production-Oriented Infrastructure

The project includes:

* Container orchestration
* Infrastructure as Code
* Secure authentication
* Distributed observability
* Automated deployment
* Service discovery
* Remote Terraform state
* Secrets management

Rather than existing as isolated demonstrations, these components work together as one complete system.

---

# Architecture at a Glance

```text
                               Internet
                                   │
                                   │
                             Amazon Route 53
                                   │
                                   │
                     Application Load Balancer
                                   │
                                   │
                    Amazon ECS Cluster (Fargate)
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      │                            │                            │
      │                            │                            │
      ▼                            ▼                            ▼
Hourairos Backend        OTEL Collector                  Grafana
      │                            │
      │                            │
      │                    ┌───────┼───────────────┐
      │                    │       │               │
      ▼                    ▼       ▼               ▼
 Cognito             Prometheus   Loki          Tempo
      │
      │
      ▼
 Secrets Manager

      │

      ▼

 Amazon S3

      │

      ▼

 CloudFront

      │

      ▼

 Static Website
```

> Replace this diagram with a proper architecture image in the future.

---

# Core Features

## User Authentication

Hourairos uses Amazon Cognito as its identity provider.

Authentication includes:

* User registration
* Secure login
* Hosted UI
* Email verification
* OAuth 2.0 Authorization Code Flow
* OpenID Connect
* JWT tokens
* Secure HTTP sessions
* Cookie-based authentication

The backend validates user sessions before allowing access to deployment features.

---

## Static Website Deployment

Users can deploy any static website by uploading a ZIP archive.

Supported technologies include:

* HTML
* CSS
* JavaScript
* Images
* Fonts
* Static assets

The backend automatically:

* Validates the uploaded archive
* Extracts the ZIP file
* Locates the project root
* Searches for the primary index.html
* Generates a unique deployment identifier
* Uploads files into Amazon S3
* Stores deployment metadata
* Returns the deployment URL

No manual deployment steps are required.

---

## Cloud Storage

Uploaded websites are stored inside Amazon S3.

Each deployment is isolated using its own directory.

Example:

```text
deployments/

├── deployment-a82d93fa/
│
├── index.html
├── css/
├── js/
├── images/
└── assets/

├── deployment-b13fa762/
│
├── index.html
├── css/
├── js/
└── assets/
```

This immutable deployment model prevents deployments from overwriting one another and makes rollback strategies easier to implement in the future.

---

## Global Content Delivery

Instead of exposing Amazon S3 directly to end users, Hourairos uses Amazon CloudFront as the content delivery layer.

CloudFront provides:

* Global edge locations
* HTTPS
* Low latency
* Edge caching
* High availability
* Better performance
* Additional security

Every uploaded website becomes globally accessible through CloudFront.

---

## Containerized Application

The backend application is packaged using Docker.

Every release produces a Docker image which is stored inside Amazon Elastic Container Registry (ECR).

Amazon ECS automatically deploys these images using AWS Fargate.

This removes the need to provision or maintain virtual machines.

---

## Infrastructure as Code

All infrastructure is managed using Terraform.

The project demonstrates both infrastructure provisioning and migration.

Existing manually created AWS resources are imported into Terraform state using Import Blocks, allowing Terraform to manage previously unmanaged infrastructure.

This closely mirrors Infrastructure as Code adoption strategies used in production environments.

---

## Observability

The application exports telemetry using OpenTelemetry.

Three telemetry signals are collected:

* Metrics
* Logs
* Distributed Traces

These signals are forwarded to an OpenTelemetry Collector before being exported to specialized monitoring systems.

This architecture keeps telemetry generation separate from telemetry storage while simplifying future expansion.

---

# Project Objectives

The primary objective of Hourairos was to gain practical experience building a production-inspired AWS platform rather than simply learning individual cloud services.

Specific objectives included:

* Designing a cloud-native architecture using managed AWS services.
* Learning Docker containerization.
* Deploying applications using Amazon ECS and AWS Fargate.
* Understanding service discovery through ECS Service Connect.
* Implementing secure authentication with Amazon Cognito.
* Building an end-to-end deployment workflow.
* Collecting metrics, logs and traces using OpenTelemetry.
* Managing infrastructure through Terraform.
* Migrating manually created AWS resources into Infrastructure as Code.
* Implementing remote Terraform state management.
* Building an automated CI/CD pipeline.
* Understanding secure GitHub to AWS authentication using OpenID Connect.

---

# Technology Stack

| Category                | Technologies               |
| ----------------------- | -------------------------- |
| Backend                 | Node.js, Express.js        |
| Frontend                | HTML, CSS, JavaScript, EJS |
| Authentication          | Amazon Cognito             |
| Containers              | Docker                     |
| Container Registry      | Amazon ECR                 |
| Container Orchestration | Amazon ECS                 |
| Compute                 | AWS Fargate                |
| Object Storage          | Amazon S3                  |
| CDN                     | Amazon CloudFront          |
| DNS                     | Amazon Route 53            |
| Monitoring              | OpenTelemetry              |
| Metrics                 | Prometheus                 |
| Logs                    | Loki                       |
| Traces                  | Tempo                      |
| Dashboards              | Grafana                    |
| Infrastructure          | Terraform                  |
| CI/CD                   | GitHub Actions             |
| Version Control         | Git & GitHub               |

---

# AWS Services Used

| AWS Service               | Purpose                        |
| ------------------------- | ------------------------------ |
| Amazon ECS                | Container orchestration        |
| AWS Fargate               | Serverless container runtime   |
| Amazon ECR                | Docker image registry          |
| Amazon Cognito            | User authentication            |
| Amazon S3                 | Static website storage         |
| Amazon CloudFront         | Content delivery network       |
| Amazon Route 53           | DNS management                 |
| Application Load Balancer | Traffic routing                |
| AWS Cloud Map             | Service discovery              |
| ECS Service Connect       | Internal service communication |
| AWS Secrets Manager       | Secrets management             |
| Amazon CloudWatch         | Application logging            |
| AWS IAM                   | Identity and access management |
| Amazon VPC                | Network isolation              |
| Terraform                 | Infrastructure as Code         |

---

# Repository Overview

The repository is divided into logical components based on responsibility.

```text
Hourairos/

├── backend/
├── infrastructure/
├── observability/
├── services/
├── utils/
├── middleware/
├── views/
├── public/
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

Each directory focuses on a specific area of the project, making the codebase easier to maintain and extend.

---

# System Architecture

The complete architecture is composed of multiple independent layers.

```text
                User
                  │
                  ▼
          Amazon Route 53
                  │
                  ▼
     Application Load Balancer
                  │
                  ▼
      Amazon ECS Cluster (Fargate)
                  │
      ┌───────────┴────────────┐
      │                        │
      ▼                        ▼
Hourairos Backend      OTEL Collector
      │                        │
      │                        │
      ▼                        ▼
Amazon Cognito          Prometheus
      │                        │
      ▼                        ▼
Secrets Manager          Grafana
      │
      ▼
Amazon S3
      │
      ▼
CloudFront
      │
      ▼
Static Website
```

The following sections describe each component in detail.
## Application Workflow

The following workflow describes the complete lifecycle of a deployment, starting from user authentication and ending with a globally accessible website.

Unlike traditional applications where uploaded files remain on the application server, Hourairos separates compute from storage by using Amazon S3 for persistent storage and Amazon CloudFront for global content delivery.

This approach follows common cloud-native design principles by keeping the application stateless while allowing deployments to scale independently.

```text
                   User

                     │

                     ▼

          Login using Cognito

                     │

                     ▼

          Authenticated Session

                     │

                     ▼

            Upload ZIP Archive

                     │

                     ▼

        Hourairos Backend (Node.js)

                     │

         ┌───────────┼────────────┐
         │           │            │
         ▼           ▼            ▼

   Validate ZIP   Extract ZIP   Locate index.html

         │           │            │

         └───────────┴────────────┘

                     │

                     ▼

      Generate Unique Deployment ID

                     │

                     ▼

          Upload Assets to Amazon S3

                     │

                     ▼

      Store Deployment Information

                     │

                     ▼

     Amazon CloudFront Distribution

                     │

                     ▼

     Website Accessible Worldwide
```

Every deployment remains independent from every other deployment.

This architecture allows future enhancements such as deployment versioning, rollback support, deployment history, and immutable releases without modifying the overall deployment workflow.

---

# Deployment Lifecycle

Each deployment consists of several independent stages.

## Step 1 — Authentication

Users authenticate through Amazon Cognito before accessing the deployment dashboard.

After successful authentication:

* Cognito validates user credentials.
* Email verification is performed (during registration).
* OAuth Authorization Code Flow is completed.
* The backend exchanges the authorization code.
* Session cookies are generated.
* Authenticated routes become accessible.

Unauthenticated users cannot deploy websites.

---

## Step 2 — ZIP Upload

Users upload a ZIP archive containing their static website.

Example:

```text
portfolio.zip
```

Supported content includes:

* HTML
* CSS
* JavaScript
* Images
* Fonts
* Static Assets

Since the platform targets static websites, no server-side runtime is required inside the uploaded project.

---

## Step 3 — Validation

Before extraction begins, the backend validates the uploaded archive.

Validation includes:

* File format
* Upload integrity
* Presence of required files
* Directory structure

Only valid deployment packages continue through the deployment pipeline.

---

## Step 4 — Extraction

The uploaded ZIP archive is extracted into a temporary directory.

Example:

```text
portfolio/

├── index.html
├── css/
├── js/
├── images/
└── assets/
```

The backend recursively searches for the primary **index.html** file to determine the deployment root.

This allows users to upload archives even when the website exists inside nested folders.

---

## Step 5 — Deployment Creation

Once validation succeeds, Hourairos generates a unique deployment identifier.

Example:

```text
deployment-53f0bcb2
```

This identifier becomes the root directory for that deployment inside Amazon S3.

```text
deployments/

├── deployment-53f0bcb2/
│
├── index.html
├── css/
├── js/
├── images/
└── assets/
```

Every deployment remains isolated.

No deployment overwrites any previously uploaded website.

---

## Step 6 — Upload to Amazon S3

The backend uploads every extracted asset into Amazon S3.

Amazon S3 was selected because it provides:

* High durability
* High availability
* Virtually unlimited storage
* Managed scalability
* Cost-effective object storage

Since the application itself remains stateless, uploaded websites persist independently of the backend containers.

---

## Step 7 — CloudFront Distribution

Instead of exposing the S3 bucket directly to users, Amazon CloudFront serves as the public content delivery layer.

CloudFront uses the S3 bucket as its origin.

Benefits include:

* Global edge locations
* Reduced latency
* HTTPS support
* Edge caching
* Better user experience
* Improved availability

Once uploaded, every deployment becomes globally accessible through CloudFront.

---

## Step 8 — Deployment Metadata

After deployment succeeds, metadata is stored for future management.

Typical metadata includes:

* Deployment ID
* User ID
* Deployment URL
* Upload timestamp
* Deployment status

This enables users to manage multiple deployments independently.

---

# Authentication Architecture

Hourairos uses Amazon Cognito as its identity provider.

Rather than implementing a custom authentication system, authentication is delegated to AWS managed identity services.

This reduces operational complexity while providing secure authentication mechanisms.

---

## Authentication Flow

```text
             User

               │

               ▼

      Click Login Button

               │

               ▼

      Amazon Cognito Hosted UI

               │

               ▼

      Enter Credentials

               │

               ▼

      Email Verification

               │

               ▼

      Authorization Code

               │

               ▼

     Backend Callback Route

               │

               ▼

     Exchange Authorization Code

               │

               ▼

      Access Token

      Refresh Token

      ID Token

               │

               ▼

      Create Session Cookie

               │

               ▼

     Access Dashboard
```

The backend validates authenticated sessions before processing deployment requests.

---

# Why Amazon Cognito?

Instead of implementing user authentication manually, Amazon Cognito was selected because it provides:

* Managed authentication
* Hosted login interface
* Email verification
* Password management
* OAuth 2.0
* OpenID Connect
* JWT token support
* Secure user pools

Using Cognito allows the application to focus on deployment functionality rather than authentication infrastructure.

---

# Session Management

After authentication succeeds, the backend creates a secure session.

Protected routes verify the authenticated session before allowing access.

Examples include:

* Dashboard
* Upload page
* Deployment history
* Account information

Unauthenticated requests are redirected back to the login page.

---

# Backend Architecture

The backend is developed using Node.js and Express.js.

Instead of acting as a traditional server-rendered application, the backend primarily orchestrates communication between AWS services.

Core responsibilities include:

* Authentication
* Session management
* ZIP upload processing
* Website extraction
* Amazon S3 uploads
* Deployment creation
* Metadata storage
* Secrets retrieval
* Telemetry generation

Because the backend remains stateless, multiple containers can execute simultaneously without sharing local application state.

---

# Internal Backend Workflow

The backend performs several coordinated operations for every deployment.

```text
Incoming Request

        │

        ▼

Authentication

        │

        ▼

Validate Upload

        │

        ▼

Extract ZIP

        │

        ▼

Locate Website Root

        │

        ▼

Generate Deployment ID

        │

        ▼

Upload to Amazon S3

        │

        ▼

Store Metadata

        │

        ▼

Return Deployment URL
```

Every operation remains independent, making the deployment workflow easier to maintain and extend.

---

# Docker Architecture

The entire backend is packaged into a Docker image before deployment.

Containerization provides several important advantages:

* Consistent runtime environment
* Dependency isolation
* Portable deployments
* Version-controlled releases
* Simplified updates
* Faster recovery

The same Docker image is used throughout development, testing, and production.

---

## Container Lifecycle

Every application update follows the same lifecycle.

```text
Application Source

        │

        ▼

Docker Build

        │

        ▼

Docker Image

        │

        ▼

Amazon ECR

        │

        ▼

Amazon ECS

        │

        ▼

AWS Fargate

        │

        ▼

Running Application
```

This ensures every deployment is reproducible and identical regardless of where it is executed.

---

# Amazon Elastic Container Registry (ECR)

Amazon ECR stores every Docker image produced by the project.

Deployment process:

1. Docker image is built.
2. Image is tagged.
3. Image is pushed to Amazon ECR.
4. ECS retrieves the latest image.
5. New tasks are launched.
6. Previous tasks are terminated after healthy replacement.

Using ECR removes the need to manually transfer application artifacts to production infrastructure.

---

# Amazon ECS

Amazon Elastic Container Service (ECS) orchestrates every application container.

Rather than managing Docker containers manually, ECS automates:

* Container scheduling
* Service health monitoring
* Task replacement
* Rolling deployments
* Service discovery
* Networking
* Integration with AWS services

Hourairos uses ECS as the central compute platform for every running application component.

---

# AWS Fargate

The project uses the AWS Fargate launch type.

Unlike traditional ECS deployments that require EC2 instances, Fargate manages the underlying compute infrastructure automatically.

Benefits include:

* No server provisioning
* No operating system management
* Automatic infrastructure provisioning
* Simplified scaling
* Reduced operational overhead
* Better workload isolation

This allows development to focus entirely on application logic rather than infrastructure maintenance.

---

# ECS Cluster Architecture

The ECS cluster hosts multiple independent services.

```text
Amazon ECS Cluster

├── Hourairos Backend
│
├── OpenTelemetry Collector
│
├── Grafana
│
└── Tempo
```

Each service performs a dedicated responsibility while remaining independently deployable.

This separation improves maintainability, scalability, and fault isolation.

---

# Application Load Balancer

All external traffic enters the platform through an AWS Application Load Balancer.

The load balancer is responsible for:

* Receiving HTTP requests
* Performing health checks
* Routing requests to healthy ECS tasks
* Distributing traffic across running containers

Because ECS tasks are ephemeral, the Application Load Balancer ensures requests are only forwarded to healthy application instances.

---

# Request Flow

```text
Internet

        │

        ▼

Amazon Route 53

        │

        ▼

Application Load Balancer

        │

        ▼

Hourairos ECS Tasks

        │

        ▼

Application Response
```

This architecture enables future horizontal scaling without requiring application changes.

---

# Networking Overview

Hourairos is deployed inside an Amazon Virtual Private Cloud (VPC).

The networking architecture separates public traffic from internal application workloads.

High-level components include:

* Amazon VPC
* Public Subnets
* Private Subnets
* Internet Gateway
* NAT Gateway
* Route Tables
* Security Groups
* Application Load Balancer

Backend containers remain isolated from direct internet access.

Only the Application Load Balancer receives public traffic.

The following section explains how ECS services communicate internally without relying on static IP addresses.
# Service Discovery using Amazon ECS Service Connect

One of the biggest challenges in containerized environments is enabling reliable communication between services.

Unlike traditional virtual machines, containers are ephemeral. Every time an ECS task is restarted, stopped, replaced, or scaled, it can receive a completely different private IP address.

If services communicated directly using private IP addresses, every restart would require application reconfiguration.

Hourairos solves this problem by using **Amazon ECS Service Connect**.

Instead of communicating through IP addresses, services communicate using logical DNS names.

This allows every service to discover and communicate with other services regardless of where they are running inside the ECS cluster.

---

# Why Service Connect?

Without Service Connect, communication would look like this:

```text
Hourairos Backend

↓

10.0.3.154

↓

OpenTelemetry Collector
```

If the OpenTelemetry Collector restarts:

```text
10.0.3.154

↓

10.0.5.203
```

The backend would still try to send telemetry to the old address, causing communication failures.

Instead, Service Connect provides a stable service name.

```text
Hourairos Backend

↓

otel-collector

↓

OpenTelemetry Collector
```

Although the underlying IP address changes, the service name remains the same.

No application configuration needs to change.

---

# How Service Connect Works in Hourairos

Every ECS service joins the same Service Connect namespace.

Example namespace:

```text
hourairos.local
```

Registered services:

```text
hourairos.local

├── hourairos-app

├── otel-collector

├── grafana

└── tempo
```

Instead of sending telemetry to:

```text
http://10.0.4.21:4318
```

the backend sends it to:

```text
http://otel-collector:4318
```

Service Connect automatically resolves the correct destination.

This abstraction allows containers to restart, scale, or move between hosts without breaking communication.

---

# AWS Cloud Map

Amazon ECS Service Connect is built on top of AWS Cloud Map.

Cloud Map acts as the service registry for the cluster.

Whenever a service starts:

1. ECS launches the task.
2. The task joins the Service Connect namespace.
3. Cloud Map registers the service.
4. Other services can immediately discover it.

Whenever a task stops:

1. ECS removes the task.
2. Cloud Map updates its records.
3. Future requests are routed to healthy tasks.

The application never interacts directly with Cloud Map.

Everything is handled automatically by ECS.

---

# Internal Service Communication

The backend currently communicates with internal services using Service Connect.

Primary communication includes:

```text
Hourairos Backend

↓

otel-collector
```

Telemetry generated by the backend is forwarded to the OpenTelemetry Collector.

The Collector then distributes telemetry to the appropriate monitoring systems.

This design keeps monitoring logic separate from the application itself.

---

# Why Cloud Map Was Selected

Cloud Map provides several advantages:

* Automatic service registration.
* Automatic service deregistration.
* DNS-based discovery.
* No manual IP management.
* Tight integration with Amazon ECS.
* Simplified scaling.

Without Cloud Map, internal service communication would require maintaining IP addresses manually.

---

# Observability

Modern distributed applications require more than simple log files.

Understanding application behaviour requires multiple telemetry signals working together.

Hourairos implements the three pillars of observability.

* Metrics
* Logs
* Distributed Traces

Rather than sending telemetry directly to monitoring tools, every signal first passes through an OpenTelemetry Collector.

This creates a centralized telemetry pipeline that can be extended without modifying application code.

---

# Observability Architecture

```text
                 Hourairos Backend

                          │

                          ▼

                 OpenTelemetry SDK

                          │

                          ▼

                OpenTelemetry Collector

          ┌───────────────┼────────────────┐

          ▼               ▼                ▼

     Prometheus         Loki            Tempo

          │               │                │

          └───────────────┼────────────────┘

                          ▼

                       Grafana
```

The application generates telemetry only once.

The Collector is responsible for distributing telemetry to the appropriate backend.

---

# OpenTelemetry

OpenTelemetry is responsible for instrumenting the backend application.

Instrumentation automatically captures information including:

* HTTP requests
* Express middleware
* Request duration
* Response latency
* Error counts
* Request traces
* Custom metrics

The backend exports telemetry using the OTLP protocol.

Instead of knowing where every monitoring backend exists, the application sends everything to a single OpenTelemetry Collector.

This greatly simplifies application configuration.

---

# Why an OpenTelemetry Collector?

Many small projects send telemetry directly to Prometheus or Tempo.

Hourairos intentionally introduces an OpenTelemetry Collector because this more closely resembles production architectures.

Advantages include:

* Centralized telemetry collection.
* Easier backend replacement.
* Data transformation.
* Filtering.
* Batch processing.
* Independent monitoring infrastructure.

Application code remains unchanged even if monitoring systems are replaced.

---

# Metrics Pipeline

Metrics measure how the application behaves over time.

Examples include:

* Request count
* Request duration
* Memory usage
* CPU usage
* Error rate
* Active requests

Metrics flow through the following pipeline.

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

Prometheus periodically scrapes exported metrics and stores them as time-series data.

Grafana visualizes this information through dashboards.

---

# Logging Pipeline

Logs provide detailed information about application events.

Examples include:

* Application startup
* Errors
* User requests
* Deployment operations
* Authentication failures

Log flow:

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

Loki stores log streams while Grafana provides searching and visualization.

Keeping logs separate from metrics improves flexibility and simplifies troubleshooting.

---

# Distributed Tracing

Metrics explain **what** happened.

Logs explain **why** something happened.

Distributed traces explain **how** a request travelled through the system.

Every incoming request receives a unique trace identifier.

That identifier follows the request throughout its lifetime.

Tracing pipeline:

```text
Hourairos Backend

↓

OTEL Collector

↓

Tempo

↓

Grafana
```

This makes it possible to understand request latency and identify performance bottlenecks.

---

# Grafana

Grafana serves as the central visualization platform.

Instead of storing telemetry directly, Grafana connects to multiple data sources.

Current data sources include:

* Prometheus
* Loki
* Tempo

This allows metrics, logs, and traces to be viewed from a single interface.

Developers can correlate telemetry from the same request without switching between multiple tools.

---

# CI/CD Pipeline

Hourairos follows a Git-based development workflow.

Application deployments are fully automated using GitHub Actions.

Rather than manually building Docker images and deploying containers, every deployment follows the same repeatable pipeline.

This reduces manual effort while ensuring consistent deployments.

---

# Development Workflow

Development follows a branch-based workflow.

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

Merge into main

        │

        ▼

GitHub Actions

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

Rolling Deployment Complete
```

Only code merged into the main branch is automatically deployed.

---

# GitHub Actions

GitHub Actions automates the deployment pipeline.

Typical workflow:

1. Checkout repository.
2. Install dependencies.
3. Build Docker image.
4. Authenticate with AWS.
5. Push image to Amazon ECR.
6. Register updated task definition.
7. Update ECS service.
8. ECS performs a rolling deployment.
9. Application Load Balancer routes traffic to healthy tasks.

This process eliminates manual deployment steps.

---

# Secure AWS Authentication using OIDC

One important design goal was avoiding permanent AWS credentials inside GitHub.

Instead of storing Access Keys and Secret Keys, the deployment pipeline uses GitHub OpenID Connect.

Authentication flow:

```text
GitHub Actions

↓

Request OIDC Token

↓

AWS IAM Identity Provider

↓

Assume Deployment Role

↓

Temporary AWS Credentials

↓

Deploy Infrastructure
```

Temporary credentials exist only during workflow execution.

No permanent AWS credentials are stored inside the repository or GitHub Secrets.

This follows AWS security best practices.

---

# Why OIDC?

Benefits include:

* No long-lived AWS credentials.
* Automatic credential expiration.
* Reduced credential leakage risk.
* Least privilege access.
* Recommended AWS authentication model.

Using OIDC significantly improves deployment security compared to traditional access keys.

---

# Deployment Strategy

Application deployments follow a rolling deployment strategy.

When a new image is available:

1. ECS starts new tasks.
2. Health checks are performed.
3. Healthy tasks receive traffic.
4. Old tasks are terminated.

Users continue accessing the application while deployments occur.

This minimizes downtime during releases.

---

# Continuous Integration vs Continuous Deployment

Within this project:

Continuous Integration is responsible for:

* Source control
* Code validation
* Docker image creation

Continuous Deployment is responsible for:

* Publishing images
* Updating ECS
* Rolling deployments

Separating these responsibilities keeps the deployment pipeline easier to maintain and expand.

---
# Infrastructure as Code

A major objective of Hourairos was to manage the entire cloud infrastructure using Infrastructure as Code (IaC).

Instead of relying solely on the AWS Management Console, infrastructure is described using Terraform configuration files. This approach makes the infrastructure version-controlled, reproducible, easier to review, and significantly simpler to maintain over time.

Every infrastructure change can be tracked alongside application changes, making deployments more predictable and reducing the chances of configuration drift.

The project uses Terraform to manage infrastructure across multiple AWS services, including networking, compute, storage, identity, monitoring, and security.

---

# Why Terraform?

Terraform was selected because it provides a declarative approach to infrastructure management.

Instead of manually configuring resources through the AWS Console, the desired infrastructure state is defined as code.

Advantages include:

* Version controlled infrastructure
* Reproducible deployments
* Easier collaboration
* Infrastructure documentation
* Reduced manual configuration
* Consistent environments
* Simplified disaster recovery
* Infrastructure review through Pull Requests

Using Terraform allows infrastructure to evolve alongside the application rather than existing as undocumented manual configurations.

---

# Terraform Project Structure

The Terraform project is organized by AWS service instead of placing every resource into a single configuration file.

This keeps related resources together, improves readability, and makes the project easier to navigate.

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

Every directory represents a logical infrastructure component, making the project easier to understand and extend.

---

# Manual Infrastructure to Infrastructure as Code

Unlike many Infrastructure as Code tutorials, Hourairos was **not** originally created using Terraform.

The project began with manually provisioned AWS resources using the AWS Management Console and AWS CLI.

Building the infrastructure manually first provided a deeper understanding of how each AWS service behaves, how services interact, and how production environments are assembled before introducing automation.

Once the architecture became stable, the infrastructure was migrated into Terraform.

This migration process reflects a real-world scenario where organizations adopt Infrastructure as Code after infrastructure has already been deployed.

---

# Terraform Import Migration

Instead of recreating the existing infrastructure, Terraform Import Blocks were used to bring existing AWS resources under Terraform management.

Migration process:

```text
AWS Console

        │

        ▼

Existing AWS Resources

        │

        ▼

Terraform Resource Blocks

        │

        ▼

Terraform Import Blocks

        │

        ▼

Terraform State

        │

        ▼

Terraform Managed Infrastructure
```

After importing, Terraform becomes responsible for tracking the infrastructure state.

Future modifications can then be performed through Terraform rather than manually through the AWS Console.

---

# Why Import Existing Resources?

In production environments, infrastructure often already exists before Terraform is introduced.

Deleting and recreating production infrastructure is rarely acceptable.

Importing existing resources provides several advantages:

* No infrastructure recreation
* No service downtime
* Existing resources remain unchanged
* Infrastructure becomes version controlled
* Future changes are managed consistently

This project demonstrates that Infrastructure as Code can be adopted incrementally without rebuilding the entire environment.

---

# Terraform Import Blocks

Terraform Import Blocks simplify the migration process by defining imports directly inside the Terraform configuration.

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

Unlike the legacy `terraform import` command, Import Blocks become part of the configuration itself.

This makes migrations reproducible and documents exactly how existing infrastructure entered Terraform management.

---

# Terraform Remote State

Terraform state is stored remotely inside Amazon S3.

Instead of keeping the state file on a local machine, every Terraform operation reads and updates a centralized state file.

Architecture:

```text
Terraform CLI

        │

        ▼

Amazon S3

        │

        ▼

terraform.tfstate
```

Using a remote backend improves collaboration while protecting the infrastructure state from accidental loss.

---

# Why Remote State?

Remote state provides several advantages:

* Shared infrastructure state
* Version history
* Team collaboration
* Backup and recovery
* Centralized management
* Reduced risk of state loss

Because every Terraform operation uses the same state file, all contributors work from a single source of truth.

---

# State Locking

Terraform state must never be modified simultaneously by multiple users.

To prevent concurrent modifications, Hourairos uses DynamoDB for state locking.

Workflow:

```text
terraform apply

        │

        ▼

Acquire Lock

        │

        ▼

Modify Infrastructure

        │

        ▼

Update State File

        │

        ▼

Release Lock
```

If another Terraform operation begins while a lock already exists, Terraform waits until the existing operation completes.

This prevents race conditions and protects the integrity of the infrastructure state.

---

# Security Architecture

Security has been incorporated throughout the project rather than being treated as an afterthought.

The platform combines multiple AWS security services and best practices to protect application data, deployment infrastructure, and user authentication.

Key security components include:

* Amazon Cognito
* AWS IAM
* AWS Secrets Manager
* Security Groups
* HTTPS
* Private Networking
* Session Authentication
* Temporary AWS Credentials through OIDC

---

# Identity and Access Management

AWS Identity and Access Management (IAM) controls access across the platform.

Separate IAM roles are used for different responsibilities.

Examples include:

* ECS Task Execution Role
* ECS Task Role
* GitHub Actions Deployment Role
* Terraform Management Role

Each role receives only the permissions required for its responsibilities, following the Principle of Least Privilege.

---

# Secrets Management

Sensitive configuration values are stored securely inside AWS Secrets Manager.

Examples include:

* Cognito configuration
* Session secrets
* Application secrets
* API credentials

Rather than embedding these values inside source code or Docker images, the application retrieves them securely during startup.

This approach keeps sensitive information out of the repository while simplifying secret rotation.

---

# Networking Security

The network architecture separates publicly accessible components from internal application workloads.

Only the Application Load Balancer receives internet traffic.

Application containers remain inside the VPC and are protected through Security Groups.

This design minimizes the attack surface while allowing controlled communication between services.

---

# Repository Organization

The repository is divided into logical sections based on responsibility.

```text
Hourairos/

├── backend/
│
├── infrastructure/
│   └── terraform/
│
├── observability/
│
├── services/
│
├── middleware/
│
├── utils/
│
├── public/
│
├── views/
│
├── .github/
│   └── workflows/
│
├── Dockerfile
├── docker-compose.yml
├── bootstrap.js
├── telemetry.js
├── metrics.js
└── README.md
```

Separating application logic, infrastructure, and observability simplifies maintenance and allows each component to evolve independently.

---

# Design Decisions

Several architectural decisions were made intentionally throughout the project.

## Why ECS Instead of EC2?

Using ECS removes much of the operational overhead associated with managing virtual machines.

Container orchestration, health monitoring, service recovery, and deployments are handled by ECS rather than manually.

---

## Why AWS Fargate?

Fargate eliminates server management entirely.

Instead of provisioning and maintaining EC2 instances, AWS manages the underlying compute infrastructure while the project focuses on containerized workloads.

---

## Why Service Connect?

Containers receive dynamic IP addresses.

Service Connect provides stable DNS-based communication between services without requiring manual service discovery.

---

## Why OpenTelemetry?

Instead of tightly coupling the application with individual monitoring systems, OpenTelemetry provides a vendor-neutral telemetry layer.

This makes the monitoring architecture easier to extend and maintain.

---

## Why Terraform?

Terraform provides consistent infrastructure management, version control, reproducibility, and automated deployments while documenting the complete cloud architecture.

---

## Why GitHub Actions?

GitHub Actions integrates directly with the source repository, allowing application deployments to be triggered automatically whenever changes are merged into the main branch.

---

# Challenges Faced During Development

Building Hourairos involved solving several practical cloud engineering challenges.

Some of the most significant challenges included:

* Understanding ECS networking.
* Learning how Service Connect discovers services.
* Configuring OpenTelemetry instrumentation.
* Building an end-to-end observability pipeline.
* Managing authentication using Amazon Cognito.
* Securely handling secrets.
* Migrating existing infrastructure into Terraform.
* Configuring GitHub Actions with AWS OIDC.
* Understanding Terraform remote state management.
* Organizing infrastructure into maintainable Terraform modules.

Each challenge contributed to a deeper understanding of how production cloud environments operate beyond simple application deployment.

---

# Lessons Learned

Hourairos provided practical experience with many areas of cloud engineering.

Some of the most valuable lessons include:

* Designing cloud-native architectures.
* Building stateless applications.
* Containerizing applications with Docker.
* Running production workloads on Amazon ECS.
* Understanding service discovery.
* Managing infrastructure using Terraform.
* Migrating manually created infrastructure into Infrastructure as Code.
* Building secure deployment pipelines.
* Implementing distributed observability.
* Designing maintainable cloud infrastructure.

More importantly, the project demonstrated that cloud engineering extends far beyond provisioning AWS services.

Building reliable systems requires understanding networking, automation, security, monitoring, deployment strategies, and operational best practices together rather than in isolation.

---

# Future Improvements

Although Hourairos demonstrates a complete cloud-native deployment platform, several enhancements are planned for future iterations.

Potential improvements include:

* Multi-environment infrastructure
* Blue/Green deployments
* Canary deployments
* ECS Auto Scaling
* AWS WAF integration
* Deployment version history
* Rollback support
* Custom deployment domains
* Deployment analytics
* Cost monitoring dashboards
* Automated infrastructure testing
* Multi-region deployments
* Disaster recovery strategy
* Backup automation

These improvements would move the project even closer to a production-grade hosting platform.

---

# Conclusion

Hourairos was built as a cloud engineering project to understand how modern applications are deployed, operated, monitored, and maintained on AWS.

Rather than focusing solely on application development, the project explores the infrastructure and operational practices that support production workloads.

The platform combines container orchestration, secure authentication, Infrastructure as Code, automated deployments, distributed observability, service discovery, and cloud-native design principles into a single cohesive architecture.

From the initial user authentication flow to global content delivery through CloudFront, every component was designed to provide hands-on experience with real AWS services and modern engineering practices.

While the application itself provides static website hosting, the primary purpose of the project is to demonstrate practical knowledge of cloud architecture, infrastructure automation, deployment workflows, networking, security, and observability.

The knowledge gained throughout the development of Hourairos extends well beyond this project and forms a strong foundation for designing, deploying, and operating production cloud environments.

---

# Author

**Mohammed Mushtaq**

Cloud Engineer | AWS | Terraform | Docker | Amazon ECS | Infrastructure as Code

GitHub: https://github.com/Mohammedmushtaq0

---

# License

This project is published for educational and portfolio purposes.

Feel free to explore the repository, study the architecture, and adapt the implementation for your own learning.
