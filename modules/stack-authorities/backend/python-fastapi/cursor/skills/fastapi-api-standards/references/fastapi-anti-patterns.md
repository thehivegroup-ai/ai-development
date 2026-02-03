# FastAPI Anti-Patterns

Common mistakes in FastAPI development and how to fix them.

---

## 1. Missing Type Hints

**Bad:**
```python
async def get_user(db, user_id):
    return await db.get(user_id)
```

**Why:** No type safety, no IDE support, Pydantic can't validate.

**Good:**
```python
async def get_user(db: AsyncSession, user_id: int) -> User:
    return await db.get(User, user_id)
```

---

## 2. Blocking I/O in Async Functions

**Bad:**
```python
@router.get("/users")
async def list_users():
    users = db.query(User).all()  # Blocking!
    return users
```

**Why:** Blocks event loop, defeats purpose of async.

**Good:**
```python
@router.get("/users")
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()
```

---

## 3. Not Using Pydantic for Validation

**Bad:**
```python
@router.post("/users")
async def create_user(email: str, password: str):
    if len(password) < 8:
        raise HTTPException(400, "Password too short")
    # manual validation...
```

**Why:** Manual validation is error-prone, not reusable.

**Good:**
```python
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

@router.post("/users")
async def create_user(user_in: UserCreate):
    # Pydantic validates automatically
```

---

## 4. Not Using Dependency Injection

**Bad:**
```python
@router.get("/users/{id}")
async def get_user(id: int):
    db = SessionLocal()  # Creating session in endpoint
    try:
        user = await db.get(User, id)
        return user
    finally:
        await db.close()
```

**Why:** Repetitive, error-prone, hard to test.

**Good:**
```python
async def get_db():
    async with async_session_maker() as session:
        yield session

@router.get("/users/{id}")
async def get_user(id: int, db: AsyncSession = Depends(get_db)):
    return await db.get(User, id)
```

---

## 5. Not Using HTTP Status Codes Correctly

**Bad:**
```python
@router.delete("/users/{id}")
async def delete_user(id: int):
    await user_service.delete(id)
    return {"message": "Deleted"}  # Returns 200
```

**Why:** Should return 204 No Content for successful deletion.

**Good:**
```python
@router.delete("/users/{id}", status_code=204)
async def delete_user(id: int, db: AsyncSession = Depends(get_db)):
    await user_service.delete(db, id=id)
    return None  # 204 has no body
```

---

## 6. Not Handling Errors Properly

**Bad:**
```python
@router.get("/users/{id}")
async def get_user(id: int):
    user = await user_service.get(id)
    return user  # Returns None if not found, should be 404
```

**Why:** Should return proper HTTP error, not null.

**Good:**
```python
@router.get("/users/{id}")
async def get_user(id: int, db: AsyncSession = Depends(get_db)):
    user = await user_service.get(db, id=id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

---

## 7. Missing response_model

**Bad:**
```python
@router.get("/users/{id}")
async def get_user(id: int):
    return await user_service.get(id)  # Returns ORM model with password!
```

**Why:** Might expose sensitive data (passwords, internal IDs).

**Good:**
```python
class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    # No password field!

@router.get("/users/{id}", response_model=UserResponse)
async def get_user(id: int):
    return await user_service.get(id)
```

---

## 8. Not Using SQLAlchemy Async Properly

**Bad:**
```python
async def get_users(db: AsyncSession):
    return db.query(User).all()  # Sync query in async function!
```

**Why:** Using sync SQLAlchemy API in async function.

**Good:**
```python
async def get_users(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()
```

---

## 9. Hardcoding Configuration

**Bad:**
```python
SECRET_KEY = "my-secret-key-12345"
DATABASE_URL = "postgresql://localhost/mydb"
```

**Why:** Secrets in code, not configurable per environment.

**Good:**
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    
    SECRET_KEY: str
    DATABASE_URL: str

settings = Settings()
```

---

## 10. Not Testing Endpoints

**Bad:**
```python
# No tests for endpoints
```

**Why:** Can't verify behavior, regressions slip through.

**Good:**
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    response = await client.post(
        "/users/",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
```

---

## Quick Checklist

Before committing FastAPI code:

- [ ] All functions have type hints
- [ ] Using async/await for I/O
- [ ] Pydantic models for validation
- [ ] Dependency injection for database sessions
- [ ] Correct HTTP status codes
- [ ] Error handling with HTTPException
- [ ] response_model hides sensitive data
- [ ] SQLAlchemy async API used correctly
- [ ] Configuration from environment variables
- [ ] Tests exist for endpoints

---

See SKILL.md for complete patterns and examples.
