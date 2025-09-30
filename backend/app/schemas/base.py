from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TimestampMixin(BaseModel):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class IDMixin(BaseModel):
    id: int