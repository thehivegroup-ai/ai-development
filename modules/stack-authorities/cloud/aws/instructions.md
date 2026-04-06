# AWS Cloud Infrastructure

**Platform-Agnostic Instructions**

This module provides AWS infrastructure deployment standards for IaC, security, and operational practices.

---

## Core Standards

**Infrastructure as Code:**
- Use AWS CDK (TypeScript), CloudFormation, or Terraform for all infrastructure
- Store IaC in version control with the application
- Review infrastructure changes through pull requests
- Use CDK constructs or modules for common patterns

**Secrets Management:**
- Store secrets in AWS Secrets Manager or Parameter Store
- Use IAM roles and policies (never access keys in code)
- Rotate secrets automatically where supported
- Audit secret access with CloudTrail

**Deployment Safety:**
- Run preflight checks before deployment (see `/cloud.aws.preflight` command)
- Document rollback procedures for each deployment
- Use CloudFormation change sets or Terraform plan to preview changes
- Implement deployment guards (budget alerts, drift detection)

**Operational Standards:**
- Tag all resources (Environment, Application, Owner, CostCenter)
- Set up CloudWatch alarms for critical metrics
- Enable CloudTrail for audit logging
- Use AWS Config for compliance monitoring

---

## Example CDK Structure

```typescript
// lib/my-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
      containerInsights: true,
    });

    // Secret
    const dbPassword = secretsmanager.Secret.fromSecretNameV2(
      this,
      'DbPassword',
      'prod/db-password'
    );

    // Task Definition
    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    taskDef.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('myapp:latest'),
      environment: {
        ENVIRONMENT: 'production',
      },
      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(dbPassword),
      },
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'app' }),
    });

    // Service
    new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
    });
  }
}
```

---

## Resource Tagging

Standard tags for all resources:

```typescript
cdk.Tags.of(this).add('Environment', 'production');
cdk.Tags.of(this).add('Application', 'my-app');
cdk.Tags.of(this).add('Owner', 'platform-team');
cdk.Tags.of(this).add('CostCenter', 'engineering');
```

---

## Required Tools

- AWS CLI v2
- AWS CDK v2 (or Terraform 1.0+)
- Node.js 18+ (for CDK)
- jq (for JSON parsing in scripts)

---

## Success Metrics

Deployment reviews MUST verify:
- ✅ IaC templates pass synthesis/validation
- ✅ No hardcoded secrets or credentials
- ✅ IAM roles use least privilege
- ✅ All resources properly tagged
- ✅ Monitoring and alarms configured
- ✅ Cost alerts enabled
- ✅ Rollback plan documented
