from fastapi import APIRouter, Depends, HTTPException, Request
from app.ai.orchestrator import AIOrchestrator
from app.api.deps import get_chat_repo, get_current_customer_id, get_orchestrator
from app.repositories.chat_repo import ChatRepository
from app.schemas.chat import ChatMessageCreate, ChatResponse, ChatSessionResponse

router = APIRouter()


@router.post("/message", response_model=ChatResponse)
async def send_chat_message(
    payload: ChatMessageCreate,
    request: Request,
    customer_id: int = Depends(get_current_customer_id),
    orchestrator: AIOrchestrator = Depends(get_orchestrator),
):
    """
    Main entrypoint for Banking Copilot conversation.
    Handles intent detection, tool execution, session context memory, and response generation.
    """
    ip_addr = request.client.host if request.client else None
    return await orchestrator.handle_user_message(
        customer_id=customer_id,
        user_message=payload.content,
        session_id=payload.session_id,
        ip_address=ip_addr,
    )


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_session(
    session_id: str,
    chat_repo: ChatRepository = Depends(get_chat_repo),
):
    session = await chat_repo.get_session_with_messages(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return session
