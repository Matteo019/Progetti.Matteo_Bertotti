from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

BODY_MAX = 5000


class PostIn(BaseModel):
    body: str = Field(min_length=1, max_length=BODY_MAX)
    image: str | None = Field(default=None, max_length=100)
    published: bool = False
    # Optional: lets me backdate a post (e.g. one first published on LinkedIn)
    created_at: datetime | None = None


class PostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    body: str
    image: str | None
    published: bool
    created_at: datetime
    updated_at: datetime


class PostPage(BaseModel):
    items: list[PostOut]
    total: int


class LoginIn(BaseModel):
    username: str = Field(max_length=100)
    password: str = Field(max_length=200)


class Me(BaseModel):
    username: str


class UploadOut(BaseModel):
    image: str
