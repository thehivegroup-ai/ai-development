# Rule Globs Update Summary

**Date:** 2026-03-09  
**Updated:** 11 stack-authority rules

---

## What Was Done

Added `globs:` patterns to stack-authority rules so they **auto-apply** when working on relevant files instead of requiring manual activation.

---

## Updated Rules (11 Total)

### Frontend (4)

#### 1. **`frontend/react-native`** ✅ NEW MODULE
```yaml
globs: "**/*.tsx,**/*.jsx,**/ios/**/*.{m,mm,h,swift},**/android/**/*.{java,kt,xml},**/*.native.*,**/app.json,**/metro.config.js"
```
**Triggers on:**
- React Native components (`.tsx`, `.jsx`)
- iOS native code (`.m`, `.mm`, `.h`, `.swift`)
- Android native code (`.java`, `.kt`, `.xml`)
- Native-specific files (`.native.*`)
- Config files (`app.json`, `metro.config.js`)

---

#### 2. **`frontend/next-tailwind`** ✅
```yaml
globs: "**/*.tsx,**/*.jsx,**/app/**/*.{ts,tsx},**/pages/**/*.{ts,tsx},**/components/**/*.{ts,tsx}"
```
**Triggers on:**
- Next.js components and pages
- App router files
- Page router files
- Component files

---

#### 3. **`frontend/vue-tailwind`** ✅
```yaml
globs: "**/*.vue,**/*.ts,**/components/**/*.{vue,ts},**/views/**/*.vue,**/composables/**/*.ts"
```
**Triggers on:**
- Vue components (`.vue`)
- TypeScript files
- View files
- Composable files

---

#### 4. **`frontend/angular-tailwind`** ✅ ALREADY HAD GLOBS
```yaml
globs: "**/*.component.ts,**/*.component.html"
```
**Status:** Already configured correctly

---

### Backend (3)

#### 5. **`backend/node-fastify`** ✅ ALREADY HAD GLOBS
```yaml
globs: "**/routes/**/*.ts,**/api/**/*.ts,**/services/**/*.ts"
```
**Status:** Already configured correctly

---

#### 6. **`backend/python-fastapi`** ✅
```yaml
globs: "**/*.py,**/routes/**/*.py,**/api/**/*.py,**/services/**/*.py,**/models/**/*.py,**/schemas/**/*.py"
```
**Triggers on:**
- All Python files
- Routes, API, services
- Models and schemas

---

#### 7. **`backend/java`** ✅
```yaml
globs: "**/src/main/java/**/*.java,**/src/test/java/**/*.java,**/pom.xml,**/build.gradle"
```
**Triggers on:**
- Java source files (main + test)
- Maven config (`pom.xml`)
- Gradle config (`build.gradle`)

---

### Database (3)

#### 8. **`database/postgres`** ✅
```yaml
globs: "**/migrations/**/*.sql,**/queries/**/*.sql,**/db/**/*.{ts,js,py},**/models/**/*.{ts,js,py},**/repositories/**/*.{ts,js,py}"
```
**Triggers on:**
- SQL migrations and queries
- Database layer code (TypeScript, JavaScript, Python)
- Models and repositories

---

#### 9. **`database/sqlserver`** ✅
```yaml
globs: "**/migrations/**/*.sql,**/queries/**/*.sql,**/db/**/*.{ts,js,py,cs},**/models/**/*.{ts,js,py,cs}"
```
**Triggers on:**
- SQL migrations and queries
- Database layer code (includes C# for .NET)
- Models

---

#### 10. **`database/mongodb`** ✅
```yaml
globs: "**/models/**/*.{ts,js,py},**/schemas/**/*.{ts,js,py},**/db/**/*.{ts,js,py},**/repositories/**/*.{ts,js,py}"
```
**Triggers on:**
- MongoDB models and schemas
- Database layer code
- Repositories

---

### Cloud (3)

#### 11. **`cloud/aws`** ✅
```yaml
globs: "**/infra/**/*.{ts,js},**/cdk/**/*.{ts,js},**/cloudformation/**/*.{yaml,yml,json},**/terraform/**/*.tf,**/serverless.yml"
```
**Triggers on:**
- AWS CDK files (TypeScript, JavaScript)
- CloudFormation templates
- Terraform configs
- Serverless configs

---

#### 12. **`cloud/gcp`** ✅
```yaml
globs: "**/infra/**/*.{ts,js},**/terraform/**/*.tf,**/deployment.yaml,**/cloudbuild.yaml,**/gcp/**/*.{yaml,yml}"
```
**Triggers on:**
- Infrastructure code
- Terraform configs
- GCP deployment manifests
- Cloud Build configs

---

#### 13. **`cloud/azure`** ✅
```yaml
globs: "**/infra/**/*.bicep,**/terraform/**/*.tf,**/azure-pipelines.yml,**/azuredeploy.json,**/arm-templates/**/*.json"
```
**Triggers on:**
- Bicep templates
- Terraform configs
- Azure Pipelines
- ARM templates

---

## Already Had Globs (Unchanged)

These rules already had proper globs configured:

1. ✅ **`frontend/react-tailwind`** - `**/*.tsx,**/*.jsx`
2. ✅ **`frontend/angular-tailwind`** - `**/*.component.ts,**/*.component.html`
3. ✅ **`backend/node-fastify`** - `**/routes/**/*.ts,**/api/**/*.ts,**/services/**/*.ts`
4. ✅ **`authentication/keycloak-bff`** - Detailed auth file patterns
5. ✅ **`enterprise-standards/04-std-environment-config`** - Config file patterns
6. ✅ **`testing/visual-parity`** - Parity test paths

---

## Impact

### Before
Rules required **manual activation**:
- User had to explicitly mention the module
- Or rules wouldn't apply at all

### After
Rules **auto-activate** based on file patterns:
- Open a `.tsx` file in React Native project → React Native rules apply ✅
- Open a `.py` file in FastAPI routes → Python FastAPI rules apply ✅
- Open a `.bicep` file → Azure rules apply ✅
- Open a `.sql` migration → Postgres/SQL Server rules apply ✅

---

## How Globs Work in Cursor

When you open or edit a file matching the glob pattern, Cursor:
1. **Automatically loads** the rule into the context
2. **Applies constraints** without needing to mention the module
3. **Shows the rule** in the active rules list

**Example:**
```typescript
// Open: src/screens/Home.tsx

// Cursor sees:
// - File matches: **/*.tsx (react-native glob)
// - Auto-loads: 20-mobile-react-native.mdc
// - AI now has React Native standards in context
// - Applies: Performance patterns, native optimization, etc.
```

---

## Glob Pattern Syntax

**Patterns used:**
- `**/*.tsx` - All `.tsx` files recursively
- `**/routes/**/*.py` - Python files in any `routes/` directory
- `**/*.{ts,tsx}` - Multiple extensions
- `**/ios/**/*.swift` - Swift files in any `ios/` directory

**Special characters:**
- `**` - Matches any directory depth
- `*` - Matches any characters in filename
- `{a,b,c}` - Matches any of a, b, or c

---

## Testing

To verify globs work:

1. **Open a file** matching a glob pattern
2. **Check Cursor's active rules** (UI shows which rules are loaded)
3. **Ask AI** to apply the standards - should reference the rule automatically

**Example test:**
```bash
# Test React Native
cd your-react-native-project
cursor src/screens/Home.tsx
# Ask AI: "Review this screen for performance issues"
# AI should reference react-native-best-practices automatically

# Test Python FastAPI
cursor api/routes/users.py
# Ask AI: "Review this route"
# AI should reference python-fastapi standards automatically
```

---

## Git Status

```
M modules/stack-authorities/backend/java/cursor/rules/31-api-java.mdc
M modules/stack-authorities/backend/python-fastapi/cursor/rules/32-api-python-fastapi.mdc
M modules/stack-authorities/cloud/aws/cursor/rules/50-cloud-aws.mdc
M modules/stack-authorities/cloud/azure/cursor/rules/52-cloud-azure.mdc
M modules/stack-authorities/cloud/gcp/cursor/rules/51-cloud-gcp.mdc
M modules/stack-authorities/database/mongodb/cursor/rules/42-db-mongodb.mdc
M modules/stack-authorities/database/postgres/cursor/rules/40-db-postgres.mdc
M modules/stack-authorities/database/sqlserver/cursor/rules/41-db-sqlserver.mdc
M modules/stack-authorities/frontend/next-tailwind/cursor/rules/21-web-next-tailwind.mdc
M modules/stack-authorities/frontend/react-native/cursor/rules/20-mobile-react-native.mdc
M modules/stack-authorities/frontend/vue-tailwind/cursor/rules/21-web-vue-tailwind.mdc
```

**11 files modified**

---

## Next Steps

1. **Commit changes:**
   ```bash
   git add modules/stack-authorities/
   git commit -m "feat: add glob patterns to stack-authority rules for auto-activation
   
   - Added globs to 11 stack-authority rules
   - Rules now auto-apply when working on matching files
   - Frontend: react-native, next-tailwind, vue-tailwind
   - Backend: python-fastapi, java
   - Database: postgres, sqlserver, mongodb
   - Cloud: aws, gcp, azure
   
   Benefits:
   - No manual rule activation needed
   - Context-aware AI assistance
   - Better developer experience"
   ```

2. **Test with MCP Server:**
   - Start MCP server: `cd mcp-server && npm start`
   - Install modules with new globs to test projects
   - Verify auto-activation works

3. **Update documentation:**
   - Consider adding glob patterns to module README files
   - Document in MCP server usage guide

---

## Benefits

### For Developers
- ✅ Rules apply automatically when needed
- ✅ No need to remember to activate modules
- ✅ Context-aware AI assistance
- ✅ Better focus (only relevant rules load)

### For Module Distribution
- ✅ Better user experience out of the box
- ✅ Modules "just work" when installed
- ✅ Matches patterns from other stack-authorities

### For AI Quality
- ✅ Correct constraints always available
- ✅ Stack-specific patterns automatically applied
- ✅ Reduces incorrect suggestions

---

## Conclusion

All stack-authority rules now have appropriate glob patterns for auto-activation. This brings them in line with best practices and significantly improves the developer experience when using these modules.

**Total updated:** 11 rules  
**Total with globs:** 17 rules (11 new + 6 existing)  
**Coverage:** All major stack authorities now have globs ✅
