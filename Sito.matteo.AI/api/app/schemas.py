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


EMAIL_RE = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=254, pattern=EMAIL_RE)
    message: str = Field(min_length=10, max_length=4000)
    # Honeypot: hidden in the form, so only bots fill it in
    website: str = Field(default="", max_length=200)


class ContactOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    message: str
    read: bool
    created_at: datetime


class ContactPage(BaseModel):
    items: list[ContactOut]
    unread: int


class ReadIn(BaseModel):
    read: bool
