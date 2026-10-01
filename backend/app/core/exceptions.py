class BankingCopilotException(Exception):
    """Base exception for Banking Copilot errors."""

    def __init__(self, message: str, code: str = "INTERNAL_ERROR"):
        self.message = message
        self.code = code
        super().__init__(self.message)


class CustomerNotFoundException(BankingCopilotException):
    def __init__(self, customer_id: int):
        super().__init__(f"Customer with ID {customer_id} not found", code="CUSTOMER_NOT_FOUND")


class AccountNotFoundException(BankingCopilotException):
    def __init__(self, account_id: int):
        super().__init__(f"Account with ID {account_id} not found", code="ACCOUNT_NOT_FOUND")


class ToolExecutionException(BankingCopilotException):
    def __init__(self, tool_name: str, reason: str):
        super().__init__(f"Failed to execute banking tool '{tool_name}': {reason}", code="TOOL_EXECUTION_ERROR")


class InvalidRequestException(BankingCopilotException):
    def __init__(self, message: str):
        super().__init__(message, code="INVALID_REQUEST")
