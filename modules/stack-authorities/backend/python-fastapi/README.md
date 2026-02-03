# Python + FastAPI Stack Authority

**Module ID:** `backend/python-fastapi`  
**Type:** Stack Authority (Backend)  
**Version:** 1.0.0

---

## Overview

This module provides standards for building REST APIs with Python, FastAPI, Pydantic validation, and async/await patterns.

---

## What's Included

- **Rule:** 32-api-python-fastapi.mdc - Complete FastAPI standards
- **Command:** api.fastapi.add-endpoint - Generate endpoints
- **Skill:** fastapi-api-standards - Implementation patterns  
- **Agent:** api.fastapi-reviewer - Code review

---

## Technology Stack

- **Python:** 3.11+
- **FastAPI:** 0.104+
- **Pydantic:** 2.0+
- **SQLAlchemy:** 2.0+ (async)
- **Uvicorn:** ASGI server
- **PostgreSQL:** Database

---

## Quick Start

```bash
# Install
pip install fastapi uvicorn sqlalchemy pydantic-settings

# Create endpoint
/api.fastapi.add-endpoint

# Run server
uvicorn app.main:app --reload
```

---

## Features

- Type hints everywhere
- Async/await for I/O
- Pydantic validation
- Dependency injection
- Auto-generated docs
- JWT authentication

---

**Module Maintained By:** AI Development Standards Team  
**Last Updated:** 2026-01-26
