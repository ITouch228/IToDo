from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa

from datetime import timedelta, datetime, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status

from ..dao.dao import UserDAO
from ..models.user import User
from ..schemas.user import UserInDB, TokenData
from ..config import settings
from ..database import get_session
from ..utils.security import oauth2_scheme

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def load_private_key():
    return serialization.load_pem_private_key(
        settings.PRIVATE_KEY.encode(),
        password=None,
        backend=default_backend()
    )

def load_public_key():
    return serialization.load_pem_public_key(
        settings.PUBLIC_KEY.encode(),
        backend=default_backend()
    )

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def authenticate_user(session: AsyncSession, email: EmailStr, password: str) -> UserInDB | bool:
    user = await UserDAO.find_one_or_none(session=session, email=email)
    if not user:
        return False
    user = UserInDB.model_validate(user)
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    private_key = load_private_key()
    encoded_jwt = jwt.encode(to_encode, private_key, algorithm='RS256')
    return encoded_jwt

async def get_current_user(session: AsyncSession = Depends(get_session), token: str = Depends(oauth2_scheme)) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        public_key = load_public_key()
        payload = jwt.decode(token, public_key, algorithms=['RS256'])
        exp = payload.get("exp")
        if exp and datetime.now(timezone.utc) > datetime.fromtimestamp(exp, tz=timezone.utc):
            raise credentials_exception

        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception

        # token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception

    user = await UserDAO.find_one_or_none(session=session, id=user_id)
    if user is None:
        raise credentials_exception

    user = UserInDB.model_validate(user)

    return user