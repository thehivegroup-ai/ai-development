# FastAPI API Standards - Reference Materials

Code examples and patterns for Python + FastAPI + Pydantic development.

---

## Contents

### Examples
- `endpoint-crud.py` - Complete CRUD endpoint
- `pydantic-models.py` - Request/response schemas
- `dependencies.py` - Dependency injection patterns
- `testing.py` - Pytest patterns for FastAPI

### Anti-Patterns
- `fastapi-anti-patterns.md` - Common mistakes

---

## Quick Reference

**Endpoint Pattern:**
```python
@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_in: UserCreate,
) -> User:
    user = await user_service.create(db, obj_in=user_in)
    return user
```

**Schema Pattern:**
```python
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
```

---

See SKILL.md for complete standards.
