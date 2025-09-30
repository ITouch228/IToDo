from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar('T')

class ResponseModel(BaseModel):
    success: bool
    message: str
    data: Optional[T] = None

class PaginatedResponse(BaseModel):
    total: int
    items: list[T]
    page: int
    size: int