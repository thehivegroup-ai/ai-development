# Cloud Azure: Deploy

Deploy application to Azure using Bicep templates.

---

## Workflow

### Step 1: Create Bicep Template

```bicep
resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: 'my-app'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
  }
}
```

### Step 2: Deploy

```bash
az deployment group create \
  --resource-group rg-myapp \
  --template-file main.bicep
```

### Step 3: Verify

```bash
az webapp show --name my-app --resource-group rg-myapp
```

---

This command deploys applications to Azure.
