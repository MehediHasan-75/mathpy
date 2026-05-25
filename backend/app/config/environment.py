from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    #overwrite model_config of BaseSettings
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

    #Application
    APP_NAME: str = "MathPy"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    # Database
    DATABASE_URL: str = "postgresql://rag_user:rag_password@localhost:5432/rag_db"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40