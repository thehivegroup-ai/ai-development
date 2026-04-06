---
name: security-review
version: 1.0.0
description: >
  Deep security analysis for solutions involving PHI, PII, authentication, or sensitive data. 
  Produces threat models, data flow diagrams, and compliance checklists.
  
  Trigger when user mentions: security review, PHI, PII, sensitive data, authentication, 
  authorization, HIPAA, GDPR, compliance, threat model, security vulnerabilities, data protection, 
  encryption, access control, or asks about securing user data, handling passwords, or API security.
---

# Security Review

**This skill provides systematic security analysis for features handling regulated or sensitive data.**

---

## When to Use

- Solution involves PHI (Protected Health Information)
- Solution involves PII (Personally Identifiable Information)
- Authentication or authorization changes
- New API endpoints with sensitive data
- Database schema changes for regulated data
- Third-party integrations with data access
- Payment processing features
- File upload features
- Before production deployment of security-critical features

## Token Optimization: Use Subagent

**For comprehensive security reviews**, launch `security-critic` subagent:

```
"Perform STRIDE threat modeling and security analysis for [feature name] involving [PHI/PII/sensitive data]"
```

**Token savings:** 60-80K tokens  
**Time savings:** 40-60% faster (parallel threat analysis)

**When to use subagent:**
- ✅ Full security review for PHI/PII features
- ✅ STRIDE threat modeling across multiple components
- ✅ Compliance documentation generation (HIPAA/GDPR)

**When to keep in main conversation:**
- ❌ Single endpoint security check
- ❌ Quick validation fix
- ❌ Minor security improvement

## Parallel Execution Strategy

**Phase 1: Analysis (PARALLEL)**
```
┌──────────────────────────────────────────────┐
│ Task A: Data Classification                  │
│         - Identify PHI/PII/Secret data       │
│         - Document regulations               │
│                                              │
│ Task B: Threat Modeling (STRIDE)             │
│         - security-critic subagent           │
│         - Identify threats per component     │
│                                              │
│ Task C: OWASP Top 10 Check                   │
│         - Validate against each category     │
│         - Document mitigations               │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 2: Data Flow Mapping (SEQUENTIAL)
• Map end-to-end data flows (needs classification)
• Mark security controls at each step
• Document encryption/auth checkpoints
                   ↓
Phase 3: Compliance Validation (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: HIPAA Checklist                      │
│         - Administrative/Technical safeguards│
│                                              │
│ Task B: GDPR Checklist (if applicable)       │
│         - Data minimization, consent, rights │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 4: Artifact Generation (SEQUENTIAL)
• Compile 4 security documents
• Security critic review and challenge
```

**Time savings:** 50-65% faster than sequential

---

## Security Review Process

### Overview

The security review process validates that a solution meets security requirements defined in `08-std-security-practices.mdc`. It produces artifacts that document threats, mitigations, and compliance.

**Process:**
1. Classify data handled by the solution
2. Model threats using STRIDE methodology
3. Map data flows and identify security controls
4. Validate against OWASP Top 10 and compliance requirements
5. Produce required security artifacts
6. Obtain approval before proceeding to implementation

---

## Step 1: Data Classification

**Goal:** Identify all data types handled by the solution and classify them.

### Questions to Ask

1. What data does this solution collect, store, or process?
2. Does it include health information (PHI)?
3. Does it include personally identifiable information (PII)?
4. Does it include credentials or secrets?
5. What is the sensitivity level of each data element?

### Classification Categories

Use classifications from `08-std-security-practices.mdc`:
- **Public:** Marketing content, public documentation
- **Internal:** Business information, not public
- **PII:** Name, email, phone, address, IP, device ID
- **PHI:** Medical records, diagnoses, prescriptions, biometric data
- **Secret:** API keys, passwords, tokens, certificates

### Output Artifact

```markdown
# Data Classification

**Last Updated:** YYYY-MM-DD  
**Feature:** [Feature name]

## Data Elements

| Data Element | Classification | Justification | Regulation |
|---|---|---|---|
| Patient name | PHI | Identifies individual + health context | HIPAA |
| Email address | PII | Identifies individual | GDPR, CCPA |
| Diagnosis codes | PHI | Health information | HIPAA |
| API keys | Secret | System credentials | N/A |
| User preferences | Internal | Business data, not regulated | N/A |

## Data Volumes
- Expected records: [number]
- Peak load: [requests/sec]
- Retention period: [duration per regulation]
```

**Save to:** `docs/security/[feature]-data-classification.md`

---

## Step 2: Threat Modeling (STRIDE)

**Goal:** Identify potential security threats using the STRIDE methodology.

### STRIDE Framework

**STRIDE = Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege**

For each component in the solution, ask these questions:

#### Spoofing (Identity)
- Can an attacker pretend to be someone else?
- Is authentication required and enforced?
- Can tokens be stolen or forged?

#### Tampering (Integrity)
- Can data be modified in transit or at rest?
- Are inputs validated?
- Is data integrity verified (checksums, signatures)?

#### Repudiation (Non-repudiation)
- Can users deny performing an action?
- Are actions logged with sufficient detail?
- Are audit logs tamper-proof?

#### Information Disclosure (Confidentiality)
- Can unauthorized users access sensitive data?
- Is data encrypted at rest and in transit?
- Do error messages leak information?

#### Denial of Service (Availability)
- Can the system be overwhelmed?
- Is rate limiting implemented?
- Are there resource limits?

#### Elevation of Privilege (Authorization)
- Can users access functions beyond their permission level?
- Is authorization checked on every request?
- Is the principle of least privilege enforced?

### Threat Identification Process

For each component:
1. Draw a simple architecture diagram (user → API → database)
2. Identify trust boundaries (where authentication/authorization changes)
3. Apply STRIDE questions to each component and boundary
4. Document threats and rate severity (High/Medium/Low)

### Output Artifact

```markdown
# Threat Model

**Last Updated:** YYYY-MM-DD  
**Feature:** [Feature name]  
**Reviewer:** [Name]

## Architecture Overview

```
[Simple ASCII diagram or link to diagram file]

User (Web) → HTTPS → API Gateway → Auth Service
                            ↓
                      Backend API → Database (encrypted)
```

## Trust Boundaries
1. **User → API Gateway:** Public internet, untrusted
2. **API Gateway → Backend:** Internal network, authenticated
3. **Backend → Database:** Localhost/VPC, service account auth

## Threats Identified

### Threat 1: Spoofing - Token Theft
- **Component:** API Gateway
- **STRIDE Category:** Spoofing
- **Description:** Attacker intercepts JWT token and impersonates user
- **Severity:** High
- **Mitigation:** 
  - Short-lived access tokens (15 min)
  - HttpOnly, Secure cookie flags
  - Token rotation on refresh
  - Anomaly detection (IP/device change)
- **Status:** Mitigated

### Threat 2: Information Disclosure - Database Breach
- **Component:** Database
- **STRIDE Category:** Information Disclosure
- **Description:** Attacker gains database access and reads PHI/PII
- **Severity:** Critical
- **Mitigation:**
  - Encryption at rest (AES-256)
  - Field-level encryption for PHI
  - Network isolation (VPC)
  - Database access audit logging
  - Principle of least privilege (service accounts)
- **Status:** Mitigated

### Threat 3: Tampering - SQL Injection
- **Component:** Backend API
- **STRIDE Category:** Tampering
- **Description:** Attacker injects SQL via user input
- **Severity:** Critical
- **Mitigation:**
  - Parameterized queries (Prisma ORM)
  - Input validation (Zod schemas)
  - Database user has minimal permissions
- **Status:** Mitigated

[... continue for all identified threats ...]

## Residual Risks

[List any risks that are accepted or partially mitigated]
```

**Save to:** `docs/security/[feature]-threat-model.md`

---

## Step 3: Data Flow Mapping

**Goal:** Visualize how sensitive data moves through the system and identify security controls.

### Data Flow Diagram Requirements

1. Show all components (frontend, API, database, external services)
2. Show data classification at each step (PHI, PII, Secret)
3. Mark encryption points (TLS in transit, AES at rest)
4. Mark authentication/authorization checkpoints
5. Mark audit logging points

### Example Data Flow

```
User Input (PHI: patient name, diagnosis)
    ↓
[TLS 1.3] → API Gateway
    ↓
[Auth Check: JWT validation] → Backend API
    ↓
[Input Validation: Zod schema]
    ↓
[Audit Log: user_id, action, timestamp] → Audit DB
    ↓
[Parameterized Query] → PHI Database (AES-256 encrypted)
    ↓
[Response: redact sensitive fields] → [TLS 1.3] → User
```

### Output Artifact

```markdown
# Data Flow Diagram

**Last Updated:** YYYY-MM-DD  
**Feature:** [Feature name]

## Data Flow: Patient Record Creation

### Input
- **Source:** Web form (patient intake)
- **Data:** Name (PHI), Email (PII), Diagnosis (PHI), Insurance ID (PHI)
- **Classification:** PHI + PII

### Flow Steps

1. **User → API Gateway**
   - Transport: HTTPS (TLS 1.3)
   - Auth: JWT in HttpOnly cookie
   - Validation: Cookie signature verified

2. **API Gateway → Auth Service**
   - Action: Validate JWT token
   - Response: User ID + permissions
   - Log: Auth attempt (user_id, timestamp, IP)

3. **API Gateway → Backend API**
   - Transport: Internal network (VPC)
   - Auth: Service account token
   - Data: JSON payload with PHI

4. **Backend API → Input Validation**
   - Library: Zod schema validation
   - Checks: Type, format, length, required fields
   - Rejects: Invalid input with generic error

5. **Backend API → Authorization Check**
   - Query: User permissions (RBAC)
   - Check: User has "patient:create" permission
   - Reject: If unauthorized (403 Forbidden)

6. **Backend API → Audit Log**
   - Log: user_id, action: "patient_create", timestamp, IP
   - Storage: Append-only audit database
   - Note: Do NOT log PHI data in audit

7. **Backend API → PHI Database**
   - Query: Parameterized INSERT via Prisma ORM
   - Encryption: Field-level encryption for PHI fields
   - Storage: Database encrypted at rest (AES-256)

8. **Backend API → Response**
   - Data: patient_id (UUID), status: "created"
   - Redaction: Do NOT return full PHI in response
   - Transport: HTTPS (TLS 1.3) → User

## Security Controls Summary

| Step | Control Type | Implementation |
|---|---|---|
| User → API | Encryption in transit | TLS 1.3 |
| API Gateway | Authentication | JWT validation |
| Backend | Authorization | RBAC permission check |
| Backend | Input validation | Zod schema |
| Backend | Audit logging | Append-only log (no PHI) |
| Database write | SQL injection prevention | Parameterized queries |
| Database | Encryption at rest | AES-256 |
| Database | Field-level encryption | PHI fields encrypted |
| Response | Information disclosure | Redact PHI from response |
```

**Save to:** `docs/security/[feature]-data-flow.md`

---

## Step 4: Security Checklist (OWASP + Compliance)

**Goal:** Validate solution against OWASP Top 10 and compliance requirements (HIPAA, GDPR).

### OWASP Top 10 Checklist

For each item, document how the solution addresses it:

```markdown
# Security Checklist

**Last Updated:** YYYY-MM-DD  
**Feature:** [Feature name]  
**Reviewer:** [Name]

## OWASP Top 10 (2021)

### A01:2021 – Broken Access Control
- [ ] Authentication required for all endpoints handling sensitive data
- [ ] Authorization checked on every request (not just UI)
- [ ] User can only access their own data (or data they have permission for)
- [ ] Default deny (explicit allow required)
- [ ] No reliance on client-side permission checks
- [ ] Directory listing disabled
- [ ] CORS configured restrictively

**Implementation:**
- JWT authentication on all `/api/patient/*` endpoints
- RBAC permission check in middleware: `requirePermission('patient:read')`
- Database queries filtered by user_id or authorized patient_ids
- Default 403 Forbidden unless explicit permission granted

**Status:** ✅ Compliant

---

### A02:2021 – Cryptographic Failures
- [ ] PHI/PII encrypted at rest (AES-256 or stronger)
- [ ] PHI/PII encrypted in transit (TLS 1.3 or 1.2 minimum)
- [ ] Secrets stored in credential manager (not in code)
- [ ] Strong algorithms used (no MD5, SHA1, weak ciphers)
- [ ] Key management implemented (rotation, access control)

**Implementation:**
- Database encryption at rest: AES-256-GCM
- Field-level encryption for PHI: `@encrypted` decorator
- TLS 1.3 enforced on all external endpoints
- Secrets in AWS Secrets Manager (API keys, DB credentials)
- KMS for key management with annual rotation

**Status:** ✅ Compliant

---

### A03:2021 – Injection
- [ ] Parameterized queries used (no string concatenation)
- [ ] ORM used with proper escaping
- [ ] Input validation on all user inputs
- [ ] NoSQL injection prevention (if applicable)
- [ ] Command injection prevention (if spawning processes)

**Implementation:**
- Prisma ORM with parameterized queries
- Zod schema validation on all API inputs
- No raw SQL queries (all via Prisma)
- No command execution in this feature

**Status:** ✅ Compliant

---

### A04:2021 – Insecure Design
- [ ] Threat model completed
- [ ] Data flow diagram created
- [ ] Security requirements defined in planning
- [ ] Defense in depth (multiple layers)
- [ ] Security review completed before build

**Implementation:**
- Threat model: `docs/security/patient-records-threat-model.md`
- Data flow: `docs/security/patient-records-data-flow.md`
- Multiple controls: auth + authz + input validation + encryption
- This security review completed before implementation

**Status:** ✅ Compliant

---

### A05:2021 – Security Misconfiguration
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] Default accounts removed/disabled
- [ ] Unnecessary features disabled
- [ ] Error messages do not leak information
- [ ] HTTPS enforced (no HTTP)
- [ ] Debug mode disabled in production

**Implementation:**
- Security headers via Helmet.js middleware
- No default accounts (all users provisioned via IAM)
- Debug logging disabled in production (env: NODE_ENV=production)
- Generic error messages to users (details server-side only)
- HTTPS redirect enforced (nginx config)

**Status:** ✅ Compliant

---

### A06:2021 – Vulnerable and Outdated Components
- [ ] Dependencies scanned for vulnerabilities
- [ ] Critical vulnerabilities patched
- [ ] Dependencies kept up to date
- [ ] Security advisories monitored

**Implementation:**
- npm audit runs in CI/CD (blocks on critical/high)
- Dependabot enabled for automated updates
- Monthly dependency review
- Critical vulnerabilities patched within 7 days

**Status:** ✅ Compliant

---

### A07:2021 – Identification and Authentication Failures
- [ ] Multi-factor authentication available (or enforced)
- [ ] Strong password policy (or SSO/passwordless)
- [ ] Session timeout implemented
- [ ] Token expiration enforced
- [ ] Credential stuffing prevention (rate limiting)
- [ ] Passwords never stored in plain text

**Implementation:**
- SSO via Keycloak (SAML 2.0)
- MFA enforced for admin roles
- Session timeout: 30 min inactivity
- JWT access token: 15 min, refresh token: 7 days
- Rate limiting: 5 failed login attempts → 15 min lockout
- Passwords hashed with bcrypt (cost: 12)

**Status:** ✅ Compliant

---

### A08:2021 – Software and Data Integrity Failures
- [ ] Code signing implemented
- [ ] Dependency integrity checks (lock files)
- [ ] CI/CD pipeline secured
- [ ] Unsigned code rejected

**Implementation:**
- CI/CD runs on dedicated runners (not shared)
- npm package-lock.json checked into git
- npm ci (not npm install) in CI/CD
- Code review required before merge

**Status:** ✅ Compliant

---

### A09:2021 – Security Logging and Monitoring Failures
- [ ] Security events logged (auth, authz, data access)
- [ ] Logs do NOT contain PHI/PII
- [ ] Logs monitored for anomalies
- [ ] Alerting configured for suspicious activity
- [ ] Audit trail immutable

**Implementation:**
- Audit logging: user_id, action, timestamp, IP (NO PHI)
- Logs sent to CloudWatch with anomaly detection
- Alerts: failed auth spike, permission denial spike
- Audit logs append-only (no delete/update)
- Log retention: 2 years (HIPAA compliance)

**Status:** ✅ Compliant

---

### A10:2021 – Server-Side Request Forgery (SSRF)
- [ ] URL validation on user-provided URLs
- [ ] Allowlist for external services
- [ ] Network segmentation (internal services not exposed)

**Implementation:**
- No user-provided URLs in this feature
- External API calls use hardcoded allowlist
- Backend in private subnet (no direct internet access)

**Status:** ✅ Compliant

---

## Compliance: HIPAA

### Administrative Safeguards
- [ ] Access control policies defined
- [ ] Security training completed
- [ ] Audit controls implemented

**Status:** ✅ BAA signed, policies documented

### Physical Safeguards
- [ ] Data center security (AWS: SOC 2 compliant)

**Status:** ✅ AWS infrastructure used

### Technical Safeguards
- [ ] Access controls (unique user IDs)
- [ ] Audit controls (logs for PHI access)
- [ ] Integrity controls (data validation)
- [ ] Transmission security (TLS)

**Status:** ✅ All implemented (see above)

---

## Compliance: GDPR (if applicable)

- [ ] Data minimization (only collect necessary data)
- [ ] User consent obtained
- [ ] Right to access (user can retrieve their data)
- [ ] Right to erasure (user can delete their data)
- [ ] Data breach notification plan (72 hours)
- [ ] Data processing agreement (DPA) with vendors

**Status:** [Document if feature involves EU users]

---

## Approval

- **Security Reviewer:** [Name]
- **Date:** YYYY-MM-DD
- **Approval:** ✅ Approved / ⚠️ Conditional / ❌ Rejected
- **Conditions:** [If conditional, list required changes]

```

**Save to:** `docs/security/[feature]-security-checklist.md`

---

## Step 5: Security Review Artifacts Summary

After completing Steps 1-4, you should have:

1. **Data Classification** (`docs/security/[feature]-data-classification.md`)
2. **Threat Model** (`docs/security/[feature]-threat-model.md`)
3. **Data Flow Diagram** (`docs/security/[feature]-data-flow.md`)
4. **Security Checklist** (`docs/security/[feature]-security-checklist.md`)

These artifacts:
- Document security decisions for auditors and future developers
- Provide evidence of due diligence
- Serve as reference during implementation
- Enable security reviews in future changes

---

## When to Update Security Artifacts

Update security artifacts when:
- Data classification changes (new PHI/PII collected)
- New threats identified during implementation
- Security controls added or removed
- Compliance requirements change
- Third-party integrations added
- After security incidents (post-mortem)

**Keep artifacts in sync with implementation.**

---

## Integration with Workflow

This skill is **independent of the solution workflow**, but can be invoked:

1. **During Solution Framing** (optional, if PHI/PII obvious upfront)
2. **After Solution Interpretation** (before planning, if security-critical)
3. **Before Implementation** (mandatory for PHI/PII features)
4. **Before Deployment** (gate: security review approved?)

**Security review is NOT part of BUILD/CLEAN/TEST/DEPLOY modes.**  
**It is a standalone analysis step triggered when security is a concern.**

---

## Invocation

To use this skill:

1. **User triggers:** "Run security review for [feature]"
2. **Agent reads:** This skill + `08-std-security-practices.mdc`
3. **Agent executes:** Steps 1-4 (data classification, threat model, data flow, checklist)
4. **Agent produces:** Four security artifacts in `docs/security/`
5. **Approval required:** Before proceeding to implementation

---

## Security Critic Agent Integration

After producing security artifacts, optionally invoke the `security-critic` agent to challenge findings:

**Prompt for agent:**
"Review the security artifacts in `docs/security/[feature]-*` and challenge:
- Are all threats identified?
- Are mitigations sufficient?
- Are there overlooked attack vectors?
- Is compliance complete?"

The agent will provide feedback, which should be incorporated into artifacts.

---

## Common Security Patterns

### Pattern: PHI/PII in Database

**Problem:** Storing PHI/PII securely

**Solution:**
- Database encryption at rest (AES-256)
- Field-level encryption for most sensitive fields
- Parameterized queries (SQL injection prevention)
- Access control (RBAC)
- Audit logging (who accessed what, when)

### Pattern: API Authentication

**Problem:** Securing API endpoints

**Solution:**
- JWT or OAuth 2.0 tokens
- Short-lived access tokens (15 min)
- Refresh tokens with rotation
- HttpOnly, Secure cookie flags
- Rate limiting (prevent brute force)

### Pattern: Logging Without PHI/PII

**Problem:** Need logs for debugging, but can't log PHI/PII

**Solution:**
- Log IDs (user_id, patient_id), not names or PHI
- Redact sensitive fields before logging objects
- Use structured logging with redaction library
- Separate audit logs (who did what) from debug logs

### Pattern: Error Handling

**Problem:** Informative errors without information disclosure

**Solution:**
- Generic error messages to users ("An error occurred")
- Detailed errors logged server-side (no PHI/PII)
- Error tracking service (Sentry, Rollbar)
- No stack traces to users

---

## References

See `08-std-security-practices.mdc` for:
- Data classification definitions
- Encryption requirements
- OWASP Top 10 guidance
- Compliance requirements (HIPAA, GDPR)

---

## Key Principle

**Security is not a checklist item at the end.**  
**It is an analysis step before building.**

This skill enables systematic security reviews that:
- Identify threats before they become vulnerabilities
- Document security decisions for compliance
- Provide confidence that security is addressed

Use this skill proactively for any feature involving regulated or sensitive data.
