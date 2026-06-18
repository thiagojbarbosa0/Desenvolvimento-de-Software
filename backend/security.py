from __future__ import annotations

import hashlib
import secrets
from typing import Optional


def hash_password(password: str, salt: Optional[str] = None) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256 with a random salt.

    Returns a string in the format: "{salt}${hex_digest}".
    """
    if salt is None:
        salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        200_000,
    ).hex()
    return f"{salt}${digest}"


def verify_password(password: str, stored: str) -> bool:
    """Verify a password against a stored salt$digest string.

    Returns True if the password matches, False otherwise. Any parsing
    errors return False.
    """
    try:
        salt, _ = stored.split("$", 1)
        return hash_password(password, salt) == stored
    except Exception:
        return False
