from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)

class UserLogin(UserBase):
    password: str = Field(..., min_length=6)

class UserInDB(UserBase):
    id: int
    username: str = Field(..., min_length=3)
    hashed_password: str = Field(..., min_length=3)

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    email: str
    username: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: int | None = None