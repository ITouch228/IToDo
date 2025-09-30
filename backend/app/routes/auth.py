from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.schemas.response import ResponseModel
from app.schemas.user import UserCreate, UserInDB, UserLogin, UserResponse, Token
from app.models.user import User
from app.database import get_session
from app.dao.dao import UserDAO

from app.services.auth import (
    get_password_hash,
    get_current_user,
    create_access_token,
    authenticate_user
)
from app.config import settings

router = APIRouter(prefix="/auth")

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, session: AsyncSession = Depends(get_session)):
    db_user = await UserDAO.find_one_or_none(session=session, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.model_dump()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))

    await UserDAO.add(session=session, **user_dict)

    return {"message": "User created successfully"}


@router.post("/login")
async def login(user: UserLogin, session: AsyncSession = Depends(get_session)):
    user = await authenticate_user(session=session, email=user.email, password=user.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: UserInDB = Depends(get_current_user)
):
    return current_user
