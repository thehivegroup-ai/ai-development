# API FastAPI: Add Endpoint

Build a FastAPI endpoint with Pydantic validation, async/await, and dependency injection.

**Apply `fastapi-api-standards` skill for detailed patterns.**

---

## Workflow

### Step 1: Define Schemas

```python
# schemas/item.py
from pydantic import BaseModel, Field
from typing import Optional

class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    price: float = Field(..., gt=0)

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)

class ItemResponse(ItemBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
```

### Step 2: Create Model

```python
# models/item.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Item(Base):
    __tablename__ = "items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### Step 3: Create Service

```python
# services/item_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate

class ItemService:
    async def get(self, db: AsyncSession, id: int) -> Optional[Item]:
        result = await db.execute(select(Item).where(Item.id == id))
        return result.scalar_one_or_none()
    
    async def create(self, db: AsyncSession, *, obj_in: ItemCreate) -> Item:
        db_obj = Item(**obj_in.model_dump())
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

item_service = ItemService()
```

### Step 4: Create Endpoint

```python
# api/v1/endpoints/items.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.schemas.item import ItemCreate, ItemResponse
from app.services import item_service

router = APIRouter()

@router.post(
    "/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_item(
    *,
    db: AsyncSession = Depends(get_db),
    item_in: ItemCreate,
) -> Item:
    item = await item_service.create(db, obj_in=item_in)
    return item

@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(
    *,
    db: AsyncSession = Depends(get_db),
    item_id: int,
) -> Item:
    item = await item_service.get(db, id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
```

### Step 5: Include Router

```python
# api/v1/router.py
from app.api.v1.endpoints import items

api_router.include_router(items.router, prefix="/items", tags=["items"])
```

---

## Output

```markdown
## Endpoint Created: POST /api/v1/items ✅

### Files Modified
- ✅ schemas/item.py (ItemCreate, ItemResponse)
- ✅ models/item.py (Item model)
- ✅ services/item_service.py (CRUD operations)
- ✅ api/v1/endpoints/items.py (Router)
- ✅ api/v1/router.py (Include router)

### Test
\`\`\`bash
curl -X POST http://localhost:8000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":10.99}'
\`\`\`

### Next Steps
1. Create database migration: `alembic revision --autogenerate`
2. Run migration: `alembic upgrade head`
3. Add tests
4. Check docs: http://localhost:8000/docs
```

---

This command generates production-ready FastAPI endpoints.
