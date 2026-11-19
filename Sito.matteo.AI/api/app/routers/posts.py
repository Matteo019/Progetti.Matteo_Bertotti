from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..auth import current_admin
from ..config import Settings, get_settings
from ..db import get_db
from ..images import delete_image, image_path, is_valid_name, save_upload
from ..models import Post
from ..schemas import PostIn, PostOut, PostPage, UploadOut

public = APIRouter(prefix="/api/posts", tags=["posts"])
admin = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(current_admin)])


def _page(db: Session, only_published: bool, offset: int, limit: int) -> PostPage:
    query = select(Post)
    count = select(func.count()).select_from(Post)
    if only_published:
        query = query.where(Post.published.is_(True))
        count = count.where(Post.published.is_(True))
    items = db.scalars(query.order_by(Post.created_at.desc(), Post.id.desc()).offset(offset).limit(limit)).all()
    return PostPage(items=items, total=db.scalar(count) or 0)


def _get_or_404(db: Session, post_id: int) -> Post:
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post non trovato")
    return post


def _check_image(name: str | None, settings: Settings) -> None:
    if name is not None and (not is_valid_name(name) or not image_path(name, settings).is_file()):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "Immagine non trovata")


# ---------- Public ----------

@public.get("", response_model=PostPage)
def list_published(
    offset: int = Query(0, ge=0),
    limit: int = Query(6, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return _page(db, True, offset, limit)


# ---------- Admin ----------

@admin.get("/posts", response_model=PostPage)
def list_all(
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return _page(db, False, offset, limit)


@admin.post("/posts", response_model=PostOut, status_code=status.HTTP_201_CREATED)
def create_post(data: PostIn, db: Session = Depends(get_db), settings: Settings = Depends(get_settings)):
    _check_image(data.image, settings)
    post = Post(**data.model_dump(exclude_none=True, exclude={"image"}), image=data.image)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@admin.put("/posts/{post_id}", response_model=PostOut)
def update_post(
    post_id: int, data: PostIn, db: Session = Depends(get_db), settings: Settings = Depends(get_settings)
):
    post = _get_or_404(db, post_id)
    _check_image(data.image, settings)
    old_image = post.image
    for key, value in data.model_dump(exclude={"created_at"}).items():
        setattr(post, key, value)
    if data.created_at is not None:
        post.created_at = data.created_at
    db.commit()
    db.refresh(post)
    if old_image and old_image != post.image:
        delete_image(old_image, settings)
    return post


@admin.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: int, db: Session = Depends(get_db), settings: Settings = Depends(get_settings)):
    post = _get_or_404(db, post_id)
    image = post.image
    db.delete(post)
    db.commit()
    delete_image(image, settings)


@admin.post("/uploads", response_model=UploadOut, status_code=status.HTTP_201_CREATED)
async def upload_image(file: UploadFile = File(...), settings: Settings = Depends(get_settings)):
    return UploadOut(image=await save_upload(file, settings))
