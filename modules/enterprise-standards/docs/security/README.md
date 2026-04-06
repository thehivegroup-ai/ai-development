# Security Standards Module

**Part of Enterprise Standards**

This module provides comprehensive security best practices for handling PHI (Protected Health Information), PII (Personally Identifiable Information), and general security in AI-assisted development.

---

## Components

### 1. Rule: `08-std-security-practices.mdc`

**Type:** Always-applied rule  
**Purpose:** Establishes security constraints for all development

**Key constraints:**
- Zero secrets in code (use env vars or credential managers)
- Zero PHI/PII in logs, errors, or debug output
- Zero PHI/PII in source code or test fixtures
- Explicit data classification (Public, Internal, PII, PHI, Secret)
- Security review required before production for PHI/PII features

**Data classification system:**
- **Public:** Marketing content, documentation
- **Internal:** Business information, not public
- **PII:** Name, email, phone, address, IP address
- **PHI:** Medical records, diagnoses, prescriptions, biometric data
- **Secret:** API keys, passwords, tokens, certificates

**Coverage:**
- OWASP Top 10 prevention patterns
- HIPAA technical safeguards
- GDPR compliance requirements (right to erasure, data minimization)
- Encryption requirements (TLS 1.3, AES-256)
- Authentication/authorization patterns
- Input validation and injection prevention
- Error handling without information disclosure
- Audit logging requirements

---

### 2. Hook: `phi-pii-scanner.sh`

**Type:** `afterFileEdit` hook  
**Purpose:** Real-time detection of PHI/PII patterns in code

**Detects:**
- **PHI patterns (Critical):**
  - Social Security Numbers (XXX-XX-XXXX)
  - Medical identifiers (diagnosis, prescription, patient_id)
  - Insurance/policy numbers
  - Biometric data references
- **PII patterns (Medium):**
  - Real email addresses (not example.com)
  - Phone numbers (US format)
  - Credit card numbers
  - Physical addresses
  - IP addresses (can be PII under GDPR)
  - Names in structured data (firstName, lastName)
  - Date of birth
- **PII in logs (Critical):**
  - Logging statements containing email, phone, SSN, names
  - Medical/patient data in logs

**Output:** Agent-visible warning with specific pattern detected and guidance for remediation

**Example:**
```
🚨 SECURITY: PHI/PII detected in src/patients.ts:
  - 🚨 SSN pattern detected (XXX-XX-XXXX)
  - ⚠️ Real email address detected (not example.com)

PER 08-std-security-practices.mdc:
- PHI/PII must NEVER appear in code, logs, or test fixtures
- Use synthetic data (test-patient-001, user@example.com)
- Use IDs instead of names in logs
```

---

### 3. Hook: `security-audit.sh`

**Type:** Manual invocation or `beforeCommit` (proposed)  
**Purpose:** Comprehensive pre-commit security checklist

**Checks:**
1. **Dependency vulnerabilities** (npm audit, safety for Python)
2. **Secret scanning** (high-confidence patterns: API keys, AWS keys, private keys)
3. **PHI/PII patterns** (SSN, credit cards, real emails)
4. **Authentication patterns** (new endpoints without auth)
5. **Insecure patterns** (SQL injection risks, XSS risks, disabled security)
6. **Environment files** (blocks .env commits)
7. **Test coverage** (auth/security code should have tests)

**Output:**
- **Critical issues:** Blocks commit, lists issues
- **Warnings:** Allows commit but warns developer
- **Pass:** ✅ Security audit passed

**Usage:**
```bash
# Manual invocation
./modules/enterprise-standards/hooks.d/security-audit.sh

# Or integrate with git hooks (user decision)
```

---

### 4. Skill: `security-review`

**Type:** Skill (manual invocation)  
**Purpose:** Deep security analysis for PHI/PII features

**Use when:**
- Solution involves PHI or PII
- Authentication or authorization changes
- New API endpoints with sensitive data
- Database schema changes for regulated data
- Third-party integrations with data access
- Before production deployment of security-critical features

**Process:**
1. **Data Classification** – Identify and classify all data (PHI, PII, Secret)
2. **Threat Modeling (STRIDE)** – Identify threats: Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege
3. **Data Flow Mapping** – Visualize data movement, encryption points, auth checks
4. **Security Checklist** – Validate against OWASP Top 10, HIPAA, GDPR

**Produces artifacts:**
- `docs/security/[feature]-data-classification.md`
- `docs/security/[feature]-threat-model.md`
- `docs/security/[feature]-data-flow.md`
- `docs/security/[feature]-security-checklist.md`

**Example invocation:**
```
"Run security review for patient records feature"
```

**Integration:** Independent of solution workflow, invoked when security is a concern

---

### 5. Agent: `security-critic`

**Type:** Subagent (invoked during security reviews)  
**Purpose:** Challenge security designs to find weaknesses

**Role:** Adversarial reviewer that assumes attacker mindset

**Challenges:**
- **Data Classification:** "Are derived fields considered PHI?"
- **Authentication:** "What if JWT is stolen?"
- **Authorization:** "Can user A access user B's data?"
- **Input Validation:** "What inputs are NOT validated?"
- **Encryption:** "Are backups encrypted?"
- **Logging:** "Can attacks go undetected?"
- **Threat Model:** "What about insider threats?"
- **Compliance:** "Is HIPAA truly met or just checked off?"

**Output format:**
- **Finding:** Concern identified
- **Severity:** Critical / High / Medium / Low
- **Attack Scenario:** How attacker exploits this
- **Current Mitigation:** What's in place
- **Recommendation:** What should be done
- **Status:** Must Fix / Accepted Risk / Optional

**Example invocation:**
```
"As Security Critic, review docs/security/patient-records-threat-model.md and challenge all assumptions"
```

**Success criteria:** Zero Critical findings, all High findings mitigated

---

## Workflow Integration

**Security standards are INDEPENDENT of solution workflow.**

They are invoked:
1. **Automatically:** Hooks run on every file edit (PHI/PII scanner, secrets scanner)
2. **On-demand:** Security review skill invoked when feature involves PHI/PII
3. **Pre-commit:** Security audit can be run manually before commit
4. **During reviews:** Security critic challenges security designs

**They do NOT block solution → plan → build → clean → test → deploy workflow.**

---

## Usage Examples

### Example 1: Building a Patient Records Feature

**Step 1:** Frame solution (hermeneutic-solution skill)

**Step 2:** Run security review
```
"Run security review for patient records feature"
```
→ Produces threat model, data flow, checklist

**Step 3:** Invoke security critic
```
"As Security Critic, review docs/security/patient-records-* artifacts"
```
→ Identifies gaps, challenges mitigations

**Step 4:** Update artifacts based on feedback

**Step 5:** Proceed to planning and implementation

**During implementation:**
- PHI/PII scanner warns if PHI detected in code
- Secrets scanner warns if API keys hardcoded
- Hygiene watchdog warns if debug code left in

---

### Example 2: Adding User Authentication

**Step 1:** Design auth system

**Step 2:** Run security review (optional, but recommended)
```
"Run security review for authentication system"
```

**Step 3:** Implement with security constraints
- Hooks warn about insecure patterns
- Security rule guides encryption, token handling

**Step 4:** Pre-commit security audit
```
./modules/enterprise-standards/hooks.d/security-audit.sh
```
→ Validates auth endpoints have tests, no secrets in code

---

### Example 3: Integrating Third-Party API

**Triggers PHI/PII concern if API receives sensitive data**

**Step 1:** Run security review
```
"Run security review for [Third-Party API] integration"
```

**Step 2:** Threat model identifies risks:
- Data sent to third party (minimization?)
- Third-party breach (data processing agreement?)
- API key storage (environment variable?)

**Step 3:** Security critic challenges:
- "What data is sent? Is it minimal?"
- "Is there a DPA signed?"
- "What if third party is breached?"

**Step 4:** Implement with mitigations documented

---

## Quick Reference

| What | Component | When | How |
|---|---|---|---|
| Prevent PHI/PII in code | `phi-pii-scanner.sh` | Every file edit (automatic) | Warns agent immediately |
| Prevent secrets in code | `secrets-scanner.sh` | Every file edit (automatic) | Warns agent immediately |
| Pre-commit security check | `security-audit.sh` | Before commit (manual) | Run script before committing |
| Deep security analysis | `security-review` skill | PHI/PII features (on-demand) | "Run security review for [feature]" |
| Challenge security design | `security-critic` agent | During security review (on-demand) | "As Security Critic, review..." |
| Security constraints reference | `08-std-security-practices.mdc` | Always (automatically loaded) | Referenced by all components |

---

## Compliance Coverage

### HIPAA (Health Insurance Portability and Accountability Act)

**Covered:**
- ✅ PHI identification and protection
- ✅ Encryption at rest and in transit (AES-256, TLS 1.3)
- ✅ Access controls (RBAC, audit logging)
- ✅ Audit logging requirements (who, what, when, where)
- ✅ Data minimization
- ✅ Business Associate Agreement (BAA) guidance

**Artifacts required:**
- Threat model (identify PHI risks)
- Data flow diagram (show encryption, access controls)
- Security checklist (validate HIPAA safeguards)

### GDPR (General Data Protection Regulation)

**Covered:**
- ✅ PII identification and protection
- ✅ Right to access (user can retrieve data)
- ✅ Right to erasure (user can delete data)
- ✅ Data minimization (collect only necessary)
- ✅ Consent management
- ✅ Data processing agreements (DPA) with vendors
- ✅ Breach notification (72-hour requirement)

**Artifacts required:**
- Data classification (identify PII)
- Data retention and deletion policies
- User data export/deletion capabilities

### CCPA (California Consumer Privacy Act)

**Covered:**
- ✅ PII identification
- ✅ Right to know (what data is collected)
- ✅ Right to delete
- ✅ Right to opt out of data sale
- ✅ "Do Not Sell My Info" link guidance

### OWASP Top 10 (2021)

**Covered:**
- ✅ A01: Broken Access Control
- ✅ A02: Cryptographic Failures
- ✅ A03: Injection
- ✅ A04: Insecure Design
- ✅ A05: Security Misconfiguration
- ✅ A06: Vulnerable and Outdated Components
- ✅ A07: Identification and Authentication Failures
- ✅ A08: Software and Data Integrity Failures
- ✅ A09: Security Logging and Monitoring Failures
- ✅ A10: Server-Side Request Forgery (SSRF)

---

## Anti-Patterns (What NOT to Do)

### ❌ Logging PHI/PII
```typescript
// ❌ WRONG
logger.info(`Processing prescription for ${patientName}`);

// ✅ CORRECT
logger.info(`Processing prescription for patient_id: ${patientId}`);
```

### ❌ PHI in Test Fixtures
```typescript
// ❌ WRONG
const testPatient = {
  name: "John Doe",
  ssn: "123-45-6789",
  diagnosis: "Diabetes"
};

// ✅ CORRECT
const testPatient = {
  patient_id: "test-patient-001",
  age: 45
  // No real PHI
};
```

### ❌ Secrets in Code
```typescript
// ❌ WRONG
const API_KEY = "sk-proj-abc123xyz...";

// ✅ CORRECT
const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) throw new Error("OPENAI_API_KEY not configured");
```

### ❌ Generic Error Messages Leaking Info
```typescript
// ❌ WRONG
throw new Error(`User ${email} not found in database table 'users'`);

// ✅ CORRECT
throw new Error("Invalid credentials");
// Log details server-side only
```

---

## Testing Security Components

### Test PHI/PII Scanner

Create a test file with PHI patterns:
```typescript
// test-phi.ts
const ssn = "123-45-6789"; // Should trigger warning
const email = "john@example.com"; // Should NOT trigger (example.com)
const realEmail = "john@gmail.com"; // Should trigger warning
```

Save file → PHI/PII scanner should warn agent

### Test Secrets Scanner

Create test file with secret patterns:
```typescript
// test-secret.ts
const apiKey = "sk-proj-abc123..."; // Should trigger critical warning
const password = "hardcoded123"; // Should trigger warning
```

Save file → Secrets scanner should warn agent

### Test Security Audit

Create commit with various issues:
```bash
# Stage file with security issues
git add test-phi.ts

# Run security audit
./modules/enterprise-standards/hooks.d/security-audit.sh

# Should block commit with critical issues
```

---

## File Locations

```
modules/enterprise-standards/
├── hooks.json
├── rules/
│   └── 08-std-security-practices.mdc
├── hooks.d/
│   ├── phi-pii-scanner.sh
│   ├── security-audit.sh
│   ├── secrets-scanner.sh
│   ├── auto-format.sh
│   ├── git-guard.sh
│   ├── hygiene-watchdog.sh
│   └── session-init.sh
├── skills/
│   └── security-review/
│       └── SKILL.md
├── agents/
│   └── security-critic.md
└── module.json
```

**Security artifacts produced by security-review skill:**
```
docs/security/
├── [feature]-data-classification.md
├── [feature]-threat-model.md
├── [feature]-data-flow.md
└── [feature]-security-checklist.md
```

---

## Summary

The security standards module provides:

1. **Proactive prevention** (hooks catch PHI/PII/secrets during development)
2. **Deep analysis** (security-review skill for comprehensive threat modeling)
3. **Adversarial testing** (security-critic agent challenges designs)
4. **Compliance artifacts** (threat models, data flows, checklists for audits)
5. **Always-on constraints** (rule establishes security requirements)

**Key principle:** Security is not an afterthought. It's built into the development process from the start, but operates independently of the solution workflow.

Use these components whenever building features that handle sensitive data, authentication, or regulated information.
