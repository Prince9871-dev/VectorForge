from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CPP_ENGINE_URL: str = "https://vectorforge-cpp.onrender.com"
    PORT: int = 8000
    API_V1_STR: str = "/api/v1"

    class Config:
        env_file = ".env"

settings = Settings()
