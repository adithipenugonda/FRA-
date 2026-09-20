from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.claim import Claim


def get_claims(
    db: Session,
    page: int = 1,
    limit: int = 20,
    district: str | None = None,
    mandal: str | None = None,
    village: str | None = None,
    status: str | None = None,
    claim_type: str | None = None,
    search: str | None = None
):
    filters = []

    if district:
        filters.append(Claim.district == district)

    if mandal:
        filters.append(Claim.mandal == mandal)

    if village:
        filters.append(Claim.village == village)

    if status:
        filters.append(Claim.status == status)

    if claim_type:
        filters.append(Claim.claim_type == claim_type)

    if search and search.strip():
        s = f"%{search.strip()}%"
        filters.append(
            (Claim.claim_id.ilike(s)) |
            (Claim.claimant_name.ilike(s)) |
            (Claim.village.ilike(s)) |
            (Claim.district.ilike(s))
        )


    offset = (page - 1) * limit

    count_query = (
        select(func.count())
        .select_from(Claim)
        .where(*filters)
    )

    total = db.scalar(count_query)

    claims_query = (
        select(Claim)
        .where(*filters)
        .order_by(Claim.claim_id)
        .offset(offset)
        .limit(limit)
    )

    claims = db.scalars(claims_query).all()

    return total, claims