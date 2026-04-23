from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CPP_ENGINE_URL: str = "http://127.0.0.1:8080"
    PORT: int = 8000
    API_V1_STR: str = "/api/v1"

    class Config:
        env_file = ".env"

settings = Settings()
