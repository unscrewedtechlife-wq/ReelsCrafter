from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from pydantic import BaseModel
from typing import Optional

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.project import Project, ProjectType, ProjectStatus

router = APIRouter()


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "general"
    team_id: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    type: str
    status: str
    thumbnail: Optional[str]
    created_at: str


@router.get("/", response_model=list[ProjectResponse])
async def list_projects(
    type: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(Project).where(
        and_(Project.user_id == user.id, Project.status != ProjectStatus.deleted)
    )
    if type:
        q = q.where(Project.type == type)
    q = q.order_by(Project.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(q)
    projects = result.scalars().all()
    return [
        ProjectResponse(
            id=p.id, name=p.name, description=p.description,
            type=p.type.value, status=p.status.value,
            thumbnail=p.thumbnail, created_at=p.created_at.isoformat()
        ) for p in projects
    ]


@router.post("/", response_model=ProjectResponse, status_code=201)
async def create_project(
    body: ProjectCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project = Project(
        user_id=user.id,
        team_id=body.team_id,
        name=body.name,
        description=body.description,
        type=ProjectType(body.type),
    )
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return ProjectResponse(
        id=project.id, name=project.name, description=project.description,
        type=project.type.value, status=project.status.value,
        thumbnail=project.thumbnail, created_at=project.created_at.isoformat()
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(and_(Project.id == project_id, Project.user_id == user.id))
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse(
        id=project.id, name=project.name, description=project.description,
        type=project.type.value, status=project.status.value,
        thumbnail=project.thumbnail, created_at=project.created_at.isoformat()
    )


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    body: ProjectUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(and_(Project.id == project_id, Project.user_id == user.id))
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if body.name is not None:
        project.name = body.name
    if body.description is not None:
        project.description = body.description
    if body.status is not None:
        project.status = ProjectStatus(body.status)

    await db.flush()
    return ProjectResponse(
        id=project.id, name=project.name, description=project.description,
        type=project.type.value, status=project.status.value,
        thumbnail=project.thumbnail, created_at=project.created_at.isoformat()
    )


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).where(and_(Project.id == project_id, Project.user_id == user.id))
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.status = ProjectStatus.deleted
    await db.flush()
