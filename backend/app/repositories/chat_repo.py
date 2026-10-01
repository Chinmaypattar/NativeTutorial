import json
from typing import Any, Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database.models import ChatMessage, ChatSession
from app.repositories.base import BaseRepository


class ChatRepository(BaseRepository[ChatSession]):
    def __init__(self, session: AsyncSession):
        super().__init__(ChatSession, session)

    async def get_session_with_messages(self, session_id: str) -> Optional[ChatSession]:
        result = await self.session.execute(
            select(ChatSession)
            .options(selectinload(ChatSession.messages))
            .where(ChatSession.id == session_id)
        )
        return result.scalars().first()

    async def get_or_create_session(self, customer_id: int, session_id: Optional[str] = None) -> ChatSession:
        if session_id:
            existing = await self.get_session_with_messages(session_id)
            if existing:
                return existing

        # Create new session
        new_session = ChatSession(
            customer_id=customer_id,
            session_title="Banking Assistant Conversation",
            context_data="{}",
        )
        self.session.add(new_session)
        await self.session.commit()
        await self.session.refresh(new_session)
        return new_session

    async def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
        tool_calls: Optional[str] = None,
        tool_call_id: Optional[str] = None,
    ) -> ChatMessage:
        msg = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            tool_calls=tool_calls,
            tool_call_id=tool_call_id,
        )
        self.session.add(msg)
        await self.session.commit()
        await self.session.refresh(msg)
        return msg

    async def get_session_context(self, session_id: str) -> Dict[str, Any]:
        session_obj = await self.get_by_id_str(session_id)
        if session_obj and session_obj.context_data:
            try:
                return json.loads(session_obj.context_data)
            except Exception:
                return {}
        return {}

    async def update_session_context(self, session_id: str, context: Dict[str, Any]) -> None:
        session_obj = await self.get_by_id_str(session_id)
        if session_obj:
            session_obj.context_data = json.dumps(context)
            await self.session.commit()

    async def get_by_id_str(self, session_id: str) -> Optional[ChatSession]:
        result = await self.session.execute(
            select(ChatSession).where(ChatSession.id == session_id)
        )
        return result.scalars().first()
