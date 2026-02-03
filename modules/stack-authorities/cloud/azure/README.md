# Microsoft Azure Stack Authority

**Module ID:** `cloud/azure`  
**Version:** 1.0.0

---

## Overview

Azure deployment standards with Bicep infrastructure as code and security best practices.

---

## What's Included

- **Rule:** 52-cloud-azure.mdc
- **Commands:** cloud.azure.deploy, cloud.azure.preflight
- **Skill:** azure-infra-standards
- **Agent:** cloud.azure-release-manager

---

## Technology

- Microsoft Azure
- Bicep templates
- Azure CLI
- Key Vault
- Managed Identities

---

## Quick Start

```bash
# Install Azure CLI
curl -L https://aka.ms/InstallAzureCli | bash

# Login
az login

# Deploy
/cloud.azure.deploy
```

---

**Last Updated:** 2026-01-26
