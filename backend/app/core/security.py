import re
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def format_inr(amount: float, show_decimal: bool = True) -> str:
    """Formats a float as Indian Rupee string (e.g. ₹2,45,680.50 or ₹54,250)."""
    abs_amt = abs(amount)
    if show_decimal:
        s = f"{abs_amt:.2f}"
        parts = s.split(".")
        integer_part, decimal_part = parts[0], parts[1]
    else:
        integer_part = str(int(round(abs_amt)))
        decimal_part = ""

    if len(integer_part) > 3:
        last3 = integer_part[-3:]
        rest = integer_part[:-3]
        groups = []
        while len(rest) > 2:
            groups.insert(0, rest[-2:])
            rest = rest[:-2]
        if rest:
            groups.insert(0, rest)
        formatted_int = ",".join(groups) + "," + last3
    else:
        formatted_int = integer_part

    prefix = "-" if amount < 0 else ""
    dec_suffix = f".{decimal_part}" if show_decimal else ""
    return f"{prefix}₹{formatted_int}{dec_suffix}"



def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


# =====================================================================
# PII Masking & Data Sanitization
# =====================================================================

FORBIDDEN_FIELDS = {"cvv", "pin", "password", "otp", "secret", "card_token", "netbanking_password"}


def mask_account_number(account_number: Optional[str]) -> str:
    """Masks an account number leaving only the last 4 digits visible."""
    if not account_number:
        return "••••••••"
    clean = re.sub(r"\s+", "", str(account_number))
    if len(clean) <= 4:
        return f"••••{clean}"
    return f"••••••••{clean[-4:]}"


def mask_card_number(card_number: Optional[str]) -> str:
    """Returns card formatted as last 4 digits only."""
    if not card_number:
        return "••••"
    clean = re.sub(r"[\s\-]+", "", str(card_number))
    return f"••••{clean[-4:]}"


def mask_email(email: Optional[str]) -> str:
    if not email or "@" not in email:
        return "••••@••••.com"
    user, domain = email.split("@", 1)
    if len(user) <= 2:
        masked_user = user[0] + "•••"
    else:
        masked_user = user[0] + "•••" + user[-1]
    return f"{masked_user}@{domain}"


def mask_phone(phone: Optional[str]) -> str:
    if not phone:
        return "••••••••••"
    clean = re.sub(r"\s+", "", str(phone))
    if len(clean) <= 4:
        return "••••" + clean
    return clean[:3] + "••••" + clean[-4:]


def sanitize_data_payload(data: Any) -> Any:
    """
    Recursively strips forbidden secrets (CVV, PIN, passwords, OTP)
    and masks sensitive account/card information.
    """
    if isinstance(data, dict):
        sanitized = {}
        for k, v in data.items():
            k_lower = k.lower()
            if any(forbidden in k_lower for forbidden in FORBIDDEN_FIELDS):
                continue  # Never expose forbidden credentials
            if "account_number" in k_lower and isinstance(v, str):
                sanitized[k] = mask_account_number(v)
            elif "card_number" in k_lower and isinstance(v, str):
                sanitized[k] = mask_card_number(v)
            else:
                sanitized[k] = sanitize_data_payload(v)
        return sanitized
    elif isinstance(data, list):
        return [sanitize_data_payload(item) for item in data]
    return data
