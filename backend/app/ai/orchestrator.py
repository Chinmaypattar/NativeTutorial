import json
from typing import Any, Dict, List, Optional
from app.ai.function_calling import LLMFunctionCallingClient
from app.ai.local_engine import LocalAIEngine
from app.ai.memory import ConversationMemoryManager
from app.ai.prompts import BANKING_COPILOT_SYSTEM_PROMPT
from app.core.logging import logger
from app.repositories.audit_repo import AuditRepository
from app.repositories.chat_repo import ChatRepository
from app.schemas.chat import ChatResponse, ToolCallExecutionRecord
from app.tools.banking_tools import BankingTools
from app.tools.registry import dispatch_tool_call


class AIOrchestrator:
    def __init__(
        self,
        banking_tools: BankingTools,
        chat_repo: ChatRepository,
        audit_repo: AuditRepository,
        llm_client: Optional[LLMFunctionCallingClient] = None,
    ):
        self.banking_tools = banking_tools
        self.chat_repo = chat_repo
        self.audit_repo = audit_repo
        self.llm_client = llm_client or LLMFunctionCallingClient()

    async def handle_user_message(
        self,
        customer_id: int,
        user_message: str,
        session_id: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> ChatResponse:
        # 1. Retrieve or create session
        session = await self.chat_repo.get_or_create_session(customer_id, session_id)
        current_session_id = session.id

        # 2. Retrieve session context memory
        context = await self.chat_repo.get_session_context(current_session_id)

        # 3. Store user message in repository
        await self.chat_repo.add_message(
            session_id=current_session_id,
            role="user",
            content=user_message,
        )

        tools_executed: List[ToolCallExecutionRecord] = []
        final_reply = ""

        # 4. Check if LLM client (Azure OpenAI / OpenAI) is available
        if self.llm_client.is_available():
            try:
                # Prepare conversation history
                db_session = await self.chat_repo.get_session_with_messages(current_session_id)
                llm_messages = [{"role": "system", "content": BANKING_COPILOT_SYSTEM_PROMPT}]

                # Include context hint if available
                if context:
                    llm_messages.append({
                        "role": "system",
                        "content": f"Active Session Context Memory: {json.dumps(context)}",
                    })

                # Append recent messages (up to last 6)
                for msg in (db_session.messages[-6:] if db_session and db_session.messages else []):
                    llm_messages.append({"role": msg.role, "content": msg.content})

                # First LLM call with tool schemas
                response_msg = await self.llm_client.call_with_tools(llm_messages)

                if response_msg and response_msg.tool_calls:
                    # Model selected tools
                    llm_messages.append({
                        "role": "assistant",
                        "content": response_msg.content or "",
                        "tool_calls": [
                            {
                                "id": tc.id,
                                "type": "function",
                                "function": {
                                    "name": tc.function.name,
                                    "arguments": tc.function.arguments,
                                },
                            }
                            for tc in response_msg.tool_calls
                        ],
                    })

                    for tc in response_msg.tool_calls:
                        tool_name = tc.function.name
                        try:
                            tool_args = json.loads(tc.function.arguments)
                        except Exception:
                            tool_args = {}

                        # Execute banking tool
                        tool_result = await dispatch_tool_call(
                            self.banking_tools,
                            tool_name,
                            tool_args,
                            customer_id,
                        )

                        tools_executed.append(
                            ToolCallExecutionRecord(
                                tool_name=tool_name,
                                arguments=tool_args,
                                result=tool_result,
                            )
                        )

                        # Audit logging
                        await self.audit_repo.log_action(
                            customer_id=customer_id,
                            action=f"TOOL_CALL:{tool_name}",
                            tool_name=tool_name,
                            parameters=tool_args,
                            status="success",
                            ip_address=ip_address,
                        )

                        # Update context memory
                        context = ConversationMemoryManager.extract_context_entities(
                            user_message, tool_args, context
                        )

                        # Append tool output to LLM messages
                        llm_messages.append({
                            "role": "tool",
                            "tool_call_id": tc.id,
                            "content": json.dumps(tool_result),
                        })

                    # Second LLM call for grounded natural language synthesis
                    synthesis_resp = await self.llm_client.client.chat.completions.create(
                        model=self.llm_client.model_name,
                        messages=llm_messages,
                        temperature=0.0,
                    )
                    final_reply = synthesis_resp.choices[0].message.content or ""
                else:
                    final_reply = response_msg.content if response_msg and response_msg.content else "I'm here to assist with your banking and financial accounts."

            except Exception as e:
                logger.error(f"Azure/OpenAI LLM execution failed: {e}. Falling back to Local AI Engine.")
                final_reply = ""

        # Fallback to Local AI Engine if LLM not available or failed
        if not final_reply:
            intent_tool, tool_args = LocalAIEngine.analyze_intent(user_message, context)

            if intent_tool:
                # Execute tool
                tool_result = await dispatch_tool_call(
                    self.banking_tools,
                    intent_tool,
                    tool_args,
                    customer_id,
                )

                tools_executed.append(
                    ToolCallExecutionRecord(
                        tool_name=intent_tool,
                        arguments=tool_args,
                        result=tool_result,
                    )
                )

                # Log audit
                await self.audit_repo.log_action(
                    customer_id=customer_id,
                    action=f"LOCAL_TOOL_CALL:{intent_tool}",
                    tool_name=intent_tool,
                    parameters=tool_args,
                    status="success",
                    ip_address=ip_address,
                )

                # Update context
                context = ConversationMemoryManager.extract_context_entities(
                    user_message, tool_args, context
                )

                final_reply = LocalAIEngine.synthesize_response(intent_tool, tool_result, user_message)
            else:
                final_reply = (
                    "I can help you review your balances, search transactions (e.g. 'How much did I spend on Flipkart?'), "
                    "check your credit cards, assess loan EMIs, evaluate affordability for big purchases, or analyze your financial health score. What would you like to explore?"
                )

        # 5. Persist assistant reply in conversation history
        await self.chat_repo.add_message(
            session_id=current_session_id,
            role="assistant",
            content=final_reply,
            tool_calls=json.dumps([t.model_dump() for t in tools_executed], default=str) if tools_executed else None,
        )

        # 6. Save updated context memory to session
        await self.chat_repo.update_session_context(current_session_id, context)

        return ChatResponse(
            session_id=current_session_id,
            reply=final_reply,
            tools_executed=tools_executed,
            session_context=context,
        )
