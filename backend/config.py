from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    FIREBASE_DB_URL: str = "https://auto-tagging-2ceba-default-rtdb.asia-southeast1.firebasedatabase.app"
    SECRET_KEY: str = "supersecretkey_please_change_me_in_production"
    JWT_EXPIRE_DAYS: int = 7

    class Config:
        env_file = ".env"

settings = Settings()
