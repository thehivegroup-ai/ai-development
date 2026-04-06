# GCP Cloud Infrastructure

**Platform-Agnostic Instructions**

This module provides GCP infrastructure deployment standards for IaC, security, and operational practices.

---

## Core Standards

**Infrastructure as Code:**
- Use Terraform, Deployment Manager, or gcloud commands for all infrastructure
- Store IaC in version control with the application
- Review infrastructure changes through pull requests
- Use Terraform modules or Cloud Foundation Toolkit for common patterns

**Secrets Management:**
- Store secrets in Secret Manager
- Use Workload Identity for GKE authentication (not service account keys)
- Use service accounts with minimal permissions
- Rotate secrets automatically where supported
- Audit secret access with Cloud Audit Logs

**Deployment Safety:**
- Run preflight checks before deployment (see `/cloud.gcp.preflight` command)
- Document rollback procedures for each deployment
- Use Terraform plan to preview changes
- Implement deployment guards (budget alerts, policy constraints)

**Operational Standards:**
- Label all resources (environment, application, owner, cost-center)
- Set up Cloud Monitoring alerts for critical metrics
- Enable Cloud Audit Logs
- Use Organization Policies for guardrails

---

## Example Terraform Structure

```hcl
# main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# GKE Cluster
resource "google_container_cluster" "primary" {
  name     = "${var.environment}-cluster"
  location = var.region

  remove_default_node_pool = true
  initial_node_count       = 1

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  addons_config {
    gce_persistent_disk_csi_driver_config {
      enabled = true
    }
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "${var.environment}-node-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  node_count = 2

  node_config {
    machine_type = "e2-medium"
    
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    labels = {
      environment = var.environment
      application = var.application
    }

    workload_metadata_config {
      mode = "GKE_METADATA"
    }
  }

  autoscaling {
    min_node_count = 1
    max_node_count = 5
  }
}

# Secret
resource "google_secret_manager_secret" "db_password" {
  secret_id = "db-password-${var.environment}"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}

# Service Account with Workload Identity
resource "google_service_account" "app" {
  account_id   = "${var.application}-${var.environment}"
  display_name = "Service account for ${var.application}"
}

resource "google_service_account_iam_binding" "workload_identity" {
  service_account_id = google_service_account.app.name
  role               = "roles/iam.workloadIdentityUser"

  members = [
    "serviceAccount:${var.project_id}.svc.id.goog[${var.namespace}/${var.service_account_name}]"
  ]
}
```

---

## Resource Labeling

Standard labels for all resources:

```hcl
locals {
  common_labels = {
    environment = var.environment
    application = var.application
    owner       = "platform-team"
    cost-center = "engineering"
    managed-by  = "terraform"
  }
}

resource "google_compute_instance" "example" {
  # ... other config
  labels = local.common_labels
}
```

---

## Required Tools

- gcloud CLI
- Terraform 1.0+
- kubectl (for GKE)
- jq (for JSON parsing in scripts)

---

## Success Metrics

Deployment reviews MUST verify:
- ✅ IaC passes validation (terraform validate / gcloud preview)
- ✅ No hardcoded secrets or service account keys
- ✅ Workload Identity configured for GKE (not key files)
- ✅ All resources properly labeled
- ✅ Monitoring and alerting configured
- ✅ Budget alerts enabled
- ✅ Rollback plan documented
