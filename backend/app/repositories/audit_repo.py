import json
from typing import Any, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import sanitize_data_payload
from app.database.models import AuditLog
from app.repositories.base import BaseRepository


class AuditRepository(BaseRepository[AuditLog]):
    def __init__(self, session: AsyncSession):
        super().__init__(AuditLog, session)

    async def log_action(
        self,
        customer_id: Optional[int],
        action: str,
        tool_name: Optional[str] = None,
        parameters: Optional[Dict[str, Any]] = None,
        status: str = "success",
        ip_address: Optional[str] = None,
    ) -> AuditLog:
        sanitized_params = sanitize_data_payload(parameters or {})
        log_entry = AuditLog(
            customer_id=customer_id,
            action=action,
            tool_name=tool_name,
            parameters=json.dumps(sanitized_params),
            status=status,
            ip_address=ip_address,
        )
        self.session.add(log_entry)
        await self.session.commit()
        return log_entry
