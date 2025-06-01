# Expenses App - Infrastructure (AWS CDK)

This directory contains the AWS Cloud Development Kit (CDK) code, written in TypeScript, to provision and manage all the necessary cloud infrastructure for the "Expenses App" full-stack application.

## Architecture Overview

The infrastructure is designed to be scalable, secure, and cost-effective, leveraging managed AWS services.

```
+-----------------------+      +------------------------+      +----------------------+
|   Frontend (Next.js)  |----->| Backend API (NestJS)   |----->|  Database (Aurora)   |
| (AWS Amplify Hosting) |      | (AWS Fargate via ECS)  |      |  (PostgreSQL)        |
+-----------------------+      +-----------+------------+      +----------------------+
                                           |
                                           |
                                           v
                                 +----------------------+
                                 |   Cache (ElastiCache |
                                 |    for Redis)        |
                                 +----------------------+
```

### 1. Networking (VPC)
* A custom **Virtual Private Cloud (VPC)** is established to provide an isolated network environment.
* It includes **public subnets** for internet-facing resources like Load Balancers and NAT Gateways.
* **Private subnets** are used for backend resources like the database, cache, and Fargate tasks to enhance security.
* NAT Gateways allow resources in private subnets to access the internet for outbound traffic (e.g., pulling dependencies) while remaining inaccessible directly from the internet.

### 2. Backend Service (NestJS Application)
* The NestJS backend application is **Dockerized**.
* The Docker image is stored in **Amazon ECR (Elastic Container Registry)**.
* The application runs as a containerized service on **AWS Fargate within Amazon ECS (Elastic Container Service)**. Fargate provides serverless compute, so you don't need to manage underlying EC2 instances.
* An **Application Load Balancer (ALB)** is provisioned to distribute incoming API requests to the Fargate tasks and can be used for SSL termination.
* The backend service connects to the Aurora PostgreSQL database and ElastiCache for Redis instance, both located in private subnets.
* Sensitive configurations like database credentials and JWT secrets are managed by **AWS Secrets Manager**.
* Application logs are streamed to **Amazon CloudWatch Logs**.

### 3. Frontend Service (Next.js Application)
* The Next.js frontend application is hosted using **AWS Amplify Hosting**.
* Amplify provides a Git-based workflow for CI/CD, building and deploying the frontend automatically upon code changes.
* It handles features like server-side rendering (SSR), static site generation (SSG), image optimization, and custom domains efficiently.
* The frontend communicates with the backend API via the backend's Application Load Balancer URL.

### 4. Database (PostgreSQL)
* **Amazon Aurora Serverless v2 (PostgreSQL compatible)** is used for the primary database.
* It offers on-demand auto-scaling of capacity, making it cost-effective for variable workloads.
* The database cluster is deployed in private subnets for enhanced security.

### 5. Caching (Redis)
* **Amazon ElastiCache for Redis** is used as an in-memory caching layer.
* This helps improve the performance of frequently accessed data and reduces load on the database.
* The Redis cluster is also deployed in private subnets.

### CDK Stacks
The infrastructure is organized into the following CDK stacks for modularity:
* `VpcStack`: Defines the VPC and core networking.
* `DatabaseStack`: Sets up the Aurora PostgreSQL database and its credentials.
* `CacheStack`: Provisions the ElastiCache for Redis cluster.
* `EcrStack`: Creates ECR repositories for Docker images.
* `BackendAppStack`: Deploys the NestJS backend application on ECS Fargate, including its Load Balancer and task definitions.
* `FrontendAppStack`: Configures the AWS Amplify application for hosting the Next.js frontend.

## Prerequisites for Deployment

* An AWS Account with the AWS CLI configured and necessary permissions.
* Node.js and npm (or yarn).
* AWS CDK Toolkit installed globally (`npm install -g aws-cdk`).
* Docker (for building images locally if your CI/CD doesn't handle it, though not strictly for `cdk deploy` if images are pre-built).
* Secrets pre-created in AWS Secrets Manager (e.g., your GitHub Personal Access Token for Amplify source integration).

## Deployment Steps

1.  **Navigate to this directory:**
    ```bash
    cd expenses-tracker/infrastructure
    ```
2.  **Install CDK dependencies:**
    ```bash
    npm install
    ```
3.  **Bootstrap CDK (if it's your first time deploying CDK apps to this AWS account/region):**
    ```bash
    cdk bootstrap aws://YOUR_ACCOUNT_ID/YOUR_REGION
    ```
    (Replace `YOUR_ACCOUNT_ID` and `YOUR_REGION` accordingly)

4.  **Synthesize CloudFormation templates (optional, to review):**
    ```bash
    cdk synth
    ```
5.  **Deploy all stacks:**
    ```bash
    cdk deploy --all
    ```
    You might be prompted to approve security-related changes.

    Alternatively, you can deploy stacks individually or in a specific order if you manage dependencies manually (though the `app.ts` attempts to set up basic dependencies).

## Important Notes
* **Costs:** Be mindful of the AWS resources being created, as they will incur costs. Use the AWS Cost Explorer to monitor. Clean up resources with `cdk destroy --all` if they are no longer needed (especially for development/testing).
* **Security:** While this setup includes private subnets and security groups, always review and adhere to AWS security best practices.
* **CI/CD:** This CDK application defines the *infrastructure*. You will typically integrate this with a CI/CD pipeline (e.g., GitHub Actions, AWS CodePipeline) that builds your application code, pushes Docker images to ECR, and then runs `cdk deploy`.
