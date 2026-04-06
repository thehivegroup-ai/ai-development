# Security Standards - Quick Start Guide

## What You Got

Five comprehensive security components for PHI, PII, and general security:

1. **Rule** (`08-std-security-practices.mdc`) - Security constraints, always enforced
2. **PHI/PII Scanner** (`phi-pii-scanner.sh`) - Real-time detection of sensitive data in code
3. **Security Audit** (`security-audit.sh`) - Pre-commit security checklist
4. **Security Review Skill** - Deep security analysis workflow
5. **Security Critic Agent** - Adversarial security reviewer

---

## Quick Test (5 minutes)

### Test 1: PHI/PII Scanner

Create a test file to see the scanner in action:

```typescript
// test-security.ts
const testData = {
  ssn: "123-45-6789",              // ← Should trigger 🚨 SSN warning
  email: "john@gmail.com",          // ← Should trigger ⚠️  real email warning
  safeEmail: "user@example.com",    // ← Should NOT trigger (example.com)
  phone: "555-1234"                 // ← Should NOT trigger (555-01xx reserved)
};

console.log("Patient:", testData); // ← Should trigger 🚨 logging PHI warning
```

**Save the file** → PHI/PII scanner will warn you immediately in the agent chat.

**Expected output:**
```
🚨 SECURITY: PHI/PII detected in test-security.ts:
  - 🚨 SSN pattern detected (XXX-XX-XXXX)
  - ⚠️ Real email address detected (not example.com)
  - 🚨 Logging statement may contain PII/PHI

PER 08-std-security-practices.mdc:
- PHI/PII must NEVER appear in code, logs, or test fixtures
- Use synthetic data (test-patient-001, user@example.com)
- Use IDs instead of names in logs
```

### Test 2: Secrets Scanner

Create a test file with a secret:

```typescript
// test-secret.ts
const apiKey = "sk-proj-abc123xyz789..."; // ← Should trigger 🚨 secret warning
```

**Save the file** → Secrets scanner warns immediately.

### Test 3: Security Audit (Manual)

Run the pre-commit security audit:

```bash
cd /Users/robertfiore/development/ai-development
./modules/enterprise-standards/hooks.d/security-audit.sh
```

It will check:
- Dependency vulnerabilities
- Secret patterns
- PHI/PII patterns
- Authentication on new endpoints
- Insecure coding patterns

---

## How to Use in Real Projects

### Scenario 1: Building a Feature with PHI/PII

**Example: Patient records system**

1. **Design your feature** (as usual with hermeneutic-solution)

2. **Run security review:**
   ```
   "Run security review for patient records feature"
   ```
   
   This will guide you through:
   - Data classification (what's PHI? what's PII?)
   - Threat modeling (STRIDE methodology)
   - Data flow mapping (where's encryption? auth?)
   - Security checklist (OWASP, HIPAA, GDPR)

3. **Produces four artifacts:**
   - `docs/security/patient-records-data-classification.md`
   - `docs/security/patient-records-threat-model.md`
   - `docs/security/patient-records-data-flow.md`
   - `docs/security/patient-records-security-checklist.md`

4. **Challenge your design:**
   ```
   "As Security Critic, review docs/security/patient-records-* artifacts"
   ```
   
   The security-critic agent will:
   - Ask hard questions ("What if JWT is stolen?")
   - Find gaps ("Can user A access user B's data?")
   - Challenge mitigations ("Are backups encrypted?")

5. **Update artifacts** based on feedback

6. **Implement** (PHI/PII scanner watches you in real-time)

7. **Before commit:**
   ```bash
   ./modules/enterprise-standards/hooks.d/security-audit.sh
   ```

### Scenario 2: Quick Check During Development

**You're coding and wonder "Is this PII?"**

Just save your code. If it contains PHI/PII, the scanner will tell you immediately.

**No action needed** - it's automatic on every file save.

### Scenario 3: Adding Authentication

**You're adding user login/auth**

1. **(Optional) Run security review:**
   ```
   "Run security review for authentication system"
   ```

2. **Or just reference the rule:**
   The rule `08-std-security-practices.mdc` has authentication patterns:
   - JWT with short expiration
   - HttpOnly, Secure cookies
   - Rate limiting
   - No secrets in code

3. **Implement following patterns**

4. **Before commit, run security audit**

---

## Key Files to Know

### Rule: Read This First
`modules/enterprise-standards/rules/08-std-security-practices.mdc`

**This is your security reference.**

Covers:
- Data classification (Public, Internal, PII, PHI, Secret)
- What NOT to do (examples of bad patterns)
- What TO do (examples of good patterns)
- OWASP Top 10 prevention
- HIPAA/GDPR compliance
- Encryption requirements
- Authentication patterns

**Read it once, reference it often.**

### Skill: Use for Deep Analysis
`modules/enterprise-standards/skills/security-review/SKILL.md`

**This is your security review process.**

Guides you through:
1. Data classification
2. Threat modeling (STRIDE)
3. Data flow mapping
4. Security checklist (OWASP, HIPAA, GDPR)

**Use when building PHI/PII features.**

### Agent: Use for Challenges
`modules/enterprise-standards/agents/security-critic.md`

**This is your adversarial reviewer.**

Challenges:
- Authentication ("What if JWT stolen?")
- Authorization ("Can users access other's data?")
- Encryption ("Are backups encrypted?")
- Compliance ("Is HIPAA truly met?")

**Use after security review to find gaps.**

---

## Common Patterns

### Pattern 1: Logging Without PHI/PII

❌ **Wrong:**
```typescript
logger.info(`Processing order for ${userEmail}`);
```

✅ **Right:**
```typescript
logger.info(`Processing order for user_id: ${userId}`);
```

### Pattern 2: Test Data Without PHI/PII

❌ **Wrong:**
```typescript
const testPatient = {
  name: "John Doe",
  ssn: "123-45-6789"
};
```

✅ **Right:**
```typescript
const testPatient = {
  patient_id: "test-patient-001",
  age: 45
  // No real PHI
};
```

### Pattern 3: Secrets from Environment

❌ **Wrong:**
```typescript
const API_KEY = "sk-proj-abc123...";
```

✅ **Right:**
```typescript
const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) throw new Error("OPENAI_API_KEY not configured");
```

### Pattern 4: Error Messages Without Info Disclosure

❌ **Wrong:**
```typescript
throw new Error(`User ${email} not found in table 'users'`);
```

✅ **Right:**
```typescript
throw new Error("Invalid credentials");
// Log details server-side only
logger.error(`Login failed`, { user_id: userId });
```

---

## When to Use What

| Situation | Use This | How |
|---|---|---|
| Building PHI/PII feature | Security Review Skill | "Run security review for [feature]" |
| Need to challenge design | Security Critic Agent | "As Security Critic, review [artifacts]" |
| Coding (real-time safety) | PHI/PII Scanner | Automatic on save |
| Before committing | Security Audit | `./modules/enterprise-standards/hooks.d/security-audit.sh` |
| Need security reference | Security Rule | Read `08-std-security-practices.mdc` |
| Compliance questions | Security Rule + Skill | Check HIPAA/GDPR sections |

---

## Compliance Cheat Sheet

### HIPAA (Healthcare)

**What's PHI?**
Medical records, diagnoses, prescriptions, insurance info, biometric data

**Requirements:**
- Encryption at rest (AES-256) and in transit (TLS 1.3)
- Access controls (RBAC) with audit logging
- BAA (Business Associate Agreement) with vendors
- Breach notification plan

**Artifacts:**
- Threat model
- Data flow diagram
- Security checklist (in `docs/security/`)

### GDPR (EU Users)

**What's PII?**
Name, email, phone, address, IP address, device ID

**Requirements:**
- User can access their data
- User can delete their data (right to erasure)
- Data minimization (only collect what's needed)
- Consent management
- DPA (Data Processing Agreement) with vendors
- 72-hour breach notification

**Artifacts:**
- Data classification
- Data retention policy
- User deletion capability

### CCPA (California)

**Requirements:**
- User can know what data is collected
- User can delete their data
- User can opt out of data sale
- "Do Not Sell My Info" link

---

## Troubleshooting

### "PHI/PII scanner didn't trigger"

**Check:**
1. Is the file a test file? Scanner skips `*.test.*`, `**/test/**`, etc.
2. Is it a non-code file? Scanner only checks code files (`.ts`, `.js`, `.py`, etc.)
3. Is the pattern unique enough? Some patterns are ignored if low confidence

### "Security audit blocked my commit"

**This is working as intended.**

Security audit found critical issues (secrets, PHI, SQL injection risks).

**Fix the issues**, then commit again.

### "How do I disable a hook?"

**Edit `hooks.json`:**

Remove the hook from the appropriate section:
```json
"afterFileEdit": [
  // Remove this to disable PHI/PII scanner
  // {
  //   "command": ".cursor/hooks/phi-pii-scanner.sh",
  //   "timeout": 5
  // }
]
```

**But consider:** Hooks catch issues early. Disabling them increases security risk.

---

## Next Steps

1. **Read the rule:** `08-std-security-practices.mdc` (your security bible)
2. **Test the scanners:** Create test files with PHI/PII/secrets
3. **Try security review:** Run it on a sample feature
4. **Integrate into workflow:** Use security review for PHI/PII features

---

## Summary

**You now have:**

✅ Real-time PHI/PII detection (automatic)  
✅ Pre-commit security checks (manual)  
✅ Deep security analysis (on-demand)  
✅ Adversarial security review (on-demand)  
✅ Comprehensive security reference (always available)

**Independent of solution workflow, but always watching.**

**Ready to build secure systems with PHI, PII, and sensitive data.**

---

## Questions?

- **What's PHI vs PII?** → Read `08-std-security-practices.mdc` → Data Classification
- **How do I do threat modeling?** → Use security-review skill → Step 2: STRIDE
- **What's OWASP Top 10?** → Read `08-std-security-practices.mdc` → Common Vulnerability Prevention
- **How do I handle logging?** → Read `08-std-security-practices.mdc` → Logging PHI/PII Safely
- **What if I need help?** → Use security-critic agent to challenge your design

**Full documentation:** `modules/enterprise-standards/docs/security/README.md`
