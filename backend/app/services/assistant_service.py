from __future__ import annotations

import re
from collections import defaultdict

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.claim import Claim


VALID_STATUSES = {"approved", "pending", "rejected"}
VALID_TYPES = {"ifr", "cfr"}


def _normalize_status(value: str | None) -> str | None:
    if value is None:
        return None
    return value.strip().lower()


def _normalize_type(value: str | None) -> str | None:
    if value is None:
        return None
    return value.strip().upper()


def _parse_query(query: str) -> dict:
    q = (query or "").strip().lower()
    if not q:
        raise ValueError("Query cannot be empty")

    if "pending" in q and "how many" in q:
        return {"intent": "count_pending"}
    if "approved" in q and "how many" in q:
        return {"intent": "count_approved"}
    if "rejected" in q and "how many" in q:
        return {"intent": "count_rejected"}
    if "ifr" in q and "how many" in q:
        return {"intent": "count_ifr"}
    if "cfr" in q and "how many" in q:
        return {"intent": "count_cfr"}
    if "pending" in q and "adilabad" in q:
        return {"intent": "pending_in_district", "district": "Adilabad"}
    if "district" in q and "most pending" in q:
        return {"intent": "top_pending_district"}
    if "average processing" in q or "avg processing" in q:
        return {"intent": "average_processing_time"}
    if "pending" in q and "180" in q and "days" in q:
        return {"intent": "old_pending_claims"}
    if "submitted in 2026" in q or "2026" in q:
        return {"intent": "claims_2026"}
    if "summary" in q and "pending" in q:
        return {"intent": "pending_summary"}
    if "fra00001" in q or "fra00002" in q or "fra00003" in q or "fra" in q and "details" in q:
        return {"intent": "claim_details"}
    if "pending claims" in q and "show" in q:
        return {"intent": "show_pending_claims"}
    if "approved" in q and "summary" in q:
        return {"intent": "approved_summary"}
    return {"intent": "unsupported"}


def _to_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def process_assistant_query(db: Session, query: str) -> dict:
    parsed = _parse_query(query)
    intent = parsed.get("intent")
    if intent == "unsupported":
        return {
            "answer": "I can answer supported FRA questions such as counts by status, district workload, IFR/CFR totals, processing averages, and details for a specific claim ID.",
            "intent": "unsupported",
            "data": None,
            "results": [],
            "query_interpretation": "No supported FRA intent matched the request.",
        }

    if intent == "count_pending":
        row = db.execute(text("SELECT COUNT(*) AS total FROM claims WHERE LOWER(status) = 'pending' ")).first()
        total = _to_int(row[0])
        return {
            "answer": f"There are {total} pending claims.",
            "intent": intent,
            "data": {"total": total},
            "results": [{"count": total, "status": "pending"}],
            "query_interpretation": "Counted all claims whose status is pending in the claims table.",
        }

    if intent == "count_approved":
        row = db.execute(text("SELECT COUNT(*) AS total FROM claims WHERE LOWER(status) = 'approved' ")).first()
        total = _to_int(row[0])
        return {
            "answer": f"There are {total} approved claims.",
            "intent": intent,
            "data": {"total": total},
            "results": [{"count": total, "status": "approved"}],
            "query_interpretation": "Counted all claims whose status is approved in the claims table.",
        }

    if intent == "count_rejected":
        row = db.execute(text("SELECT COUNT(*) AS total FROM claims WHERE LOWER(status) = 'rejected' ")).first()
        total = _to_int(row[0])
        return {
            "answer": f"There are {total} rejected claims.",
            "intent": intent,
            "data": {"total": total},
            "results": [{"count": total, "status": "rejected"}],
            "query_interpretation": "Counted all claims whose status is rejected in the claims table.",
        }

    if intent == "count_ifr":
        row = db.execute(text("SELECT COUNT(*) AS total FROM claims WHERE UPPER(COALESCE(claim_type, '')) = 'IFR' ")).first()
        total = _to_int(row[0])
        return {
            "answer": f"There are {total} IFR claims.",
            "intent": intent,
            "data": {"total": total},
            "results": [{"count": total, "claim_type": "IFR"}],
            "query_interpretation": "Counted all claims with claim_type equal to IFR.",
        }

    if intent == "count_cfr":
        row = db.execute(text("SELECT COUNT(*) AS total FROM claims WHERE UPPER(COALESCE(claim_type, '')) = 'CFR' ")).first()
        total = _to_int(row[0])
        return {
            "answer": f"There are {total} CFR claims.",
            "intent": intent,
            "data": {"total": total},
            "results": [{"count": total, "claim_type": "CFR"}],
            "query_interpretation": "Counted all claims with claim_type equal to CFR.",
        }

    if intent == "pending_in_district":
        district = parsed.get("district", "Adilabad")
        rows = db.execute(text("SELECT COUNT(*) AS total FROM claims WHERE LOWER(status) = 'pending' AND LOWER(district) = :district"), {"district": district.lower()}).fetchall()
        total = _to_int(rows[0][0]) if rows else 0
        return {
            "answer": f"There are {total} pending claims in {district}.",
            "intent": intent,
            "data": {"district": district, "total": total},
            "results": [{"district": district, "pending_count": total}],
            "query_interpretation": f"Filtered pending claims to district {district} and counted the result.",
        }

    if intent == "top_pending_district":
        rows = db.execute(text("SELECT district, COUNT(*) AS pending_count FROM claims WHERE LOWER(status) = 'pending' GROUP BY district ORDER BY pending_count DESC, district ASC LIMIT 5")).mappings().all()
        if not rows:
            return {
                "answer": "There are no pending claims in the current dataset.",
                "intent": intent,
                "data": {"districts": []},
                "results": [],
                "query_interpretation": "There were no records with pending status, so no district workload was available.",
            }
        top = rows[0]
        return {
            "answer": f"The district with the most pending claims is {top['district']} with {top['pending_count']} pending claims.",
            "intent": intent,
            "data": {"district": top["district"], "pending_count": top["pending_count"], "top_results": [dict(r) for r in rows]},
            "results": [dict(r) for r in rows],
            "query_interpretation": "Grouped pending claims by district and ordered by pending count descending.",
        }

    if intent == "average_processing_time":
        row = db.execute(text("SELECT ROUND(AVG(processing_days)::numeric, 1) AS avg_processing_days FROM claims WHERE processing_days IS NOT NULL")).first()
        value = row[0] if row else None
        avg = float(value) if value is not None else 0.0
        return {
            "answer": f"The average processing time for claims with recorded processing days is {avg:.1f} days.",
            "intent": intent,
            "data": {"average_processing_days": avg},
            "results": [{"average_processing_days": round(avg, 1)}],
            "query_interpretation": "Computed the average of processing_days across claims that have a valid processing duration.",
        }

    if intent == "old_pending_claims":
        rows = db.execute(text("SELECT claim_id, district, pending_days FROM claims WHERE LOWER(status) = 'pending' AND pending_days > 180 ORDER BY pending_days DESC LIMIT 10")).mappings().all()
        total = len(rows)
        return {
            "answer": f"There are {total} pending claims with more than 180 days in pendency.",
            "intent": intent,
            "data": {"total": total, "claims": [dict(r) for r in rows]},
            "results": [dict(r) for r in rows],
            "query_interpretation": "Filtered pending claims where pending_days exceeds 180, then sorted them by longest pending period.",
        }

    if intent == "claims_2026":
        rows = db.execute(text("SELECT COUNT(*) AS total FROM claims WHERE submission_date >= '2026-01-01' AND submission_date < '2027-01-01' ")).first()
        total = _to_int(rows[0])
        return {
            "answer": f"There were {total} claims submitted in 2026.",
            "intent": intent,
            "data": {"year": 2026, "total": total},
            "results": [{"year": 2026, "total": total}],
            "query_interpretation": "Counted claims whose submission_date falls within the 2026 calendar year.",
        }

    if intent == "pending_summary":
        rows = db.execute(text("SELECT COUNT(*) AS total_pending, ROUND(AVG(pending_days)::numeric, 1) AS avg_pending_days FROM claims WHERE LOWER(status) = 'pending'")).first()
        total = _to_int(rows[0])
        avg = float(rows[1]) if rows[1] is not None else 0.0
        return {
            "answer": f"There are {total} pending claims; the average pending duration is {avg:.1f} days.",
            "intent": intent,
            "data": {"pending_claims": total, "average_pending_days": round(avg, 1)},
            "results": [{"pending_claims": total, "average_pending_days": round(avg, 1)}],
            "query_interpretation": "Summarized the pending claim queue and the average pending duration among those claims.",
        }

    if intent == "show_pending_claims":
        rows = db.execute(text("SELECT claim_id, district, claimant_name, status, pending_days FROM claims WHERE LOWER(status) = 'pending' ORDER BY pending_days DESC NULLS LAST LIMIT 10")).mappings().all()
        payload = [dict(r) for r in rows]
        return {
            "answer": f"Showing the 10 longest-pending claims. The first result is {payload[0]['claim_id']} in {payload[0]['district']} with {payload[0]['pending_days']} pending days." if payload else "There are no pending claims to show.",
            "intent": intent,
            "data": {"claims": payload},
            "results": payload,
            "query_interpretation": "Fetched the most pending claim records ordered by pending_days descending.",
        }

    if intent == "approved_summary":
        rows = db.execute(text("SELECT COUNT(*) AS total, ROUND(AVG(processing_days)::numeric, 1) AS avg_processing FROM claims WHERE LOWER(status) = 'approved'")).first()
        total = _to_int(rows[0])
        avg = float(rows[1]) if rows[1] is not None else 0.0
        return {
            "answer": f"There are {total} approved claims with an average processing time of {avg:.1f} days.",
            "intent": intent,
            "data": {"approved_claims": total, "average_processing_days": round(avg, 1)},
            "results": [{"approved_claims": total, "average_processing_days": round(avg, 1)}],
            "query_interpretation": "Calculated approved claim counts and average processing duration from the claims table.",
        }

    if intent == "claim_details":
        claim_id_pattern = re.search(r"fra\d+", query, re.IGNORECASE)
        claim_id = claim_id_pattern.group(0).upper() if claim_id_pattern else None
        if not claim_id:
            return {
                "answer": "Please specify a claim ID such as FRA00001 to retrieve claim details.",
                "intent": intent,
                "data": None,
                "results": [],
                "query_interpretation": "Unable to identify a valid FRA claim ID from the user query.",
            }
        row = db.execute(text("SELECT claim_id, claimant_name, district, mandal, village, status, claim_type, land_area_acres, submission_date, pending_days FROM claims WHERE UPPER(claim_id) = :claim_id"), {"claim_id": claim_id}).mappings().first()
        if not row:
            return {
                "answer": f"I could not find any claim matching {claim_id}.",
                "intent": intent,
                "data": None,
                "results": [],
                "query_interpretation": f"Searched the claims table for claim_id equal to {claim_id} and found no rows.",
            }
        return {
            "answer": f"Claim {row['claim_id']} belongs to {row['claimant_name']} in {row['district']} ({row['village']}). Current status is {row['status']} and claim type is {row['claim_type']}.",
            "intent": intent,
            "data": dict(row),
            "results": [dict(row)],
            "query_interpretation": "Retrieved the requested claim record directly from the claims table.",
        }

    return {
        "answer": "I can answer supported FRA queries using the live claims database.",
        "intent": intent,
        "data": None,
        "results": [],
        "query_interpretation": "Default fallback response based on the supported FRA query intents.",
    }
