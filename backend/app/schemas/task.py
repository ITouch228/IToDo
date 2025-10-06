from datetime import datetime
from pydantic import BaseModel, Field
from pydantic import field_validator
from typing import Optional

class TaskBase(BaseModel):
    title: str = Field(...)
    description: Optional[str] = None
    deadline: Optional[str] = None
    priority: Optional[int] = 2
    is_completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskEdit(TaskBase):
    id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[str] = None
    priority: Optional[int] = None
    is_completed: Optional[bool] = None

class TaskInDB(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True