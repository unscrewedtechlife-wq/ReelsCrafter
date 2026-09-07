from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from slugify import slugify

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.team import Team, TeamMember, TeamRole

router = APIRouter()


class TeamCreate(BaseModel):
    name: str


class InviteMember(BaseModel):
    email: EmailStr
    role: str = "member"


@router.post("/", status_code=201)
async def create_team(
    body: TeamCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    base_slug = slugify(body.name)
    # Ensure slug uniqueness
    slug = base_slug
    i = 1
    while True:
        result = await db.execute(select(Team).where(Team.slug == slug))
        if not result.scalar_one_or_none():
            break
        slug = f"{base_slug}-{i}"
        i += 1

    team = Team(owner_id=user.id, name=body.name, slug=slug)
    db.add(team)
    await db.flush()

    # Add owner as member
    member = TeamMember(team_id=team.id, user_id=user.id, role=TeamRole.owner)
    db.add(member)
    await db.flush()
    await db.refresh(team)

    return {"id": team.id, "name": team.name, "slug": team.slug, "plan": team.plan}


@router.get("/")
async def get_my_teams(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Team).join(TeamMember).where(TeamMember.user_id == user.id)
    )
    teams = result.scalars().all()
    return [{"id": t.id, "name": t.name, "slug": t.slug, "plan": t.plan} for t in teams]


@router.post("/{team_id}/invite")
async def invite_member(
    team_id: str,
    body: InviteMember,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify caller is owner/admin
    member_result = await db.execute(
        select(TeamMember).where(
            TeamMember.team_id == team_id, TeamMember.user_id == user.id
        )
    )
    caller = member_result.scalar_one_or_none()
    if not caller or caller.role not in [TeamRole.owner, TeamRole.admin]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Find target user
    target_result = await db.execute(select(User).where(User.email == body.email))
    target = target_result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    # Check not already member
    existing = await db.execute(
        select(TeamMember).where(TeamMember.team_id == team_id, TeamMember.user_id == target.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User is already a team member")

    new_member = TeamMember(team_id=team_id, user_id=target.id, role=TeamRole(body.role))
    db.add(new_member)
    await db.flush()

    return {"message": f"Invited {body.email} as {body.role}"}


@router.get("/{team_id}/members")
async def list_members(
    team_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(TeamMember, User)
        .join(User, TeamMember.user_id == User.id)
        .where(TeamMember.team_id == team_id)
    )
    rows = result.all()
    return [
        {
            "id": m.id, "user_id": u.id, "name": u.name,
            "email": u.email, "role": m.role.value,
            "invited_at": m.invited_at.isoformat(),
        }
        for m, u in rows
    ]


@router.delete("/{team_id}/members/{member_user_id}", status_code=204)
async def remove_member(
    team_id: str,
    member_user_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    caller_result = await db.execute(
        select(TeamMember).where(TeamMember.team_id == team_id, TeamMember.user_id == user.id)
    )
    caller = caller_result.scalar_one_or_none()
    if not caller or caller.role not in [TeamRole.owner, TeamRole.admin]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    target_result = await db.execute(
        select(TeamMember).where(TeamMember.team_id == team_id, TeamMember.user_id == member_user_id)
    )
    target = target_result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=404, detail="Member not found")
    if target.role == TeamRole.owner:
        raise HTTPException(status_code=400, detail="Cannot remove team owner")

    await db.delete(target)
    await db.flush()
