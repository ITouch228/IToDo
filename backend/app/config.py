import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

BASE_DIR = Path(__file__).resolve().parents[1]

class Settings(BaseSettings):
    # env
    ENV: str = Field(default="dev")  # dev/stage/prod

    # Database
    DB_USER: str = "postgres"
    DB_PASSWORD: str = Field(default="")
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "itodo"

    # JWT
    ALGORITHM: str = "RS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 1

    PRIVATE_KEY_PATH: Path = Field(default=BASE_DIR / "keys" / "private.pem")
    PUBLIC_KEY_PATH: Path = Field(default=BASE_DIR / "keys" / "public.pem")

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def get_db_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    @property
    def PRIVATE_KEY(self) -> str:
        return self.PRIVATE_KEY_PATH.read_text(encoding="utf-8")

    @property
    def PUBLIC_KEY(self) -> str:
        return self.PUBLIC_KEY_PATH.read_text(encoding="utf-8")


settings = Settings()
