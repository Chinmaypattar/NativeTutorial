from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class ChatMessageCreate(BaseModel):
    content: str
    session_id: Optional[str] = None
    customer_id: Optional[int] = None


class ChatMessageResponse(BaseModel):
    id: int
    session_id: str
    role: str
    content: str
    tool_calls: Optional[str] = None
    tool_call_id: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatSessionResponse(BaseModel):
    id: str
    customer_id: int
    session_title: str
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageResponse] = []

    model_config = ConfigDict(from_attributes=True)


class ToolCallExecutionRecord(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
    result: Any


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    tools_executed: List[ToolCallExecutionRecord] = []
    session_context: Dict[str, Any] = {}
