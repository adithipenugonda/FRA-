from typing import Any

from pydantic import BaseModel, ConfigDict


class AssistantQueryRequest(BaseModel):
    query: str


class AssistantQueryResponse(BaseModel):
    answer: str
    intent: str | None = None
    data: Any | None = None
    results: list[dict] | None = None
    query_interpretation: str | None = None

    model_config = ConfigDict(from_attributes=True)
