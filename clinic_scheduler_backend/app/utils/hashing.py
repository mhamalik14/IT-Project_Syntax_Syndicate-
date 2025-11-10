from passlib.context import CryptContext

# Configure Passlib context to use bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def truncate_utf8(password: str, max_bytes: int = 72) -> str:
    """
    Truncate a UTF-8 password to fit within bcrypt's 72-byte limit
    without breaking multi-byte characters.
    """
    encoded = password.encode("utf-8")
    if len(encoded) <= max_bytes:
        return password

    truncated = encoded[:max_bytes]
    while True:
        try:
            return truncated.decode("utf-8")
        except UnicodeDecodeError:
            truncated = truncated[:-1]  # remove last byte and try again


def hash_password(password: str) -> str:
    """
    Hash the password safely, truncating if necessary.
    """
    safe_password = truncate_utf8(password)
    return pwd_context.hash(safe_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash, truncating if necessary.
    """
    safe_password = truncate_utf8(plain_password)
    return pwd_context.verify(safe_password, hashed_password)
