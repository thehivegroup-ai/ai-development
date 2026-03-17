---
name: azure-infra-standards
version: 1.0.0
description: >
  Azure infrastructure patterns with Bicep templates, Managed Identities, and Key Vault. Use when 
  provisioning Azure resources, writing Bicep templates, configuring identity and secrets management, 
  or reviewing cloud infrastructure.
  
  Trigger when user mentions: Azure infrastructure, Bicep, ARM templates, Managed Identity, Key Vault, 
  Azure Functions, App Service, Azure SQL, resource group, deployment to Azure, or asks about Azure 
  best practices or infrastructure.
---

# Skill: Azure Infrastructure Standards

**Technology:** Microsoft Azure + Bicep  
**Skill Type:** Cloud Infrastructure

---

## Core Patterns

### 1. Bicep Templates
```bicep
resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}
```

### 2. Managed Identity
```bicep
resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  identity: {
    type: 'SystemAssigned'
  }
}
```

### 3. Key Vault Integration
```bicep
resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  properties: {
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: webApp.identity.principalId
        permissions: {
          secrets: ['get']
        }
      }
    ]
  }
}
```

---

This skill provides Azure best practices.
