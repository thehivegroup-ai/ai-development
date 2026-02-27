---
name: fastapi-api-standards
description: FastAPI REST API patterns with Pydantic, SQLAlchemy, and async/await. Use when building FastAPI endpoints, defining Pydantic schemas, setting up dependency injection, or structuring a Python API project.
---

# Skill: FastAPI API Standards

**Technology:** Python + FastAPI + Pydantic + SQLAlchemy  
**Skill Type:** Backend API Development  
**Applies To:** REST API development with Python

---

## Core Patterns

### 1. Project Structure

```
app/
├── main.py              # FastAPI app instance
├── core/
│   ├── config.py        # Pydantic settings
│   ├── database.py      # SQLAlchemy setup
│   └── security.py      # Auth utilities
├── api/
│   └── v1/
│       ├── router.py    # Main API router
│       └── endpoints/
│           ├── users.py
│           └── items.py
├── models/              # SQLAlchemy models
│   ├── user.py
│   └── item.py
├── schemas/             # Pydantic schemas
│   ├── user.py
│   └── item.py
└── services/            # Business logic
    ├── user_service.py
    └── item_service.py
```

### 2. Type Hints

```python
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

async def get_users(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
) -> List[User]:
    """Always use type hints"""
    pass
```

### 3. Async/Await

```python
# Always async for I/O
@router.get("/users")
async def list_users(db: AsyncSession = Depends(get_db)):
    users = await user_service.get_multi(db)
    return users
```

### 4. Pydantic Validation

```python
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    age: int = Field(..., gt=0, lt=150)
```

### 5. Dependency Injection

```python
from fastapi import Depends

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    # Validate token, get user
    return user

@router.get("/me")
async def read_users_me(
    current_user: User = Depends(get_current_user),
):
    return current_user
```

---

This skill provides FastAPI best practices.
