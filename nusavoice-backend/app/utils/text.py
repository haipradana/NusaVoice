import re

_space_re = re.compile(r"\s+")
_control_re = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F]")

def clean_text(text: str) -> str:
    text = text.strip()
    text = _control_re.sub(" ", text)
    text = _space_re.sub(" ", text)
    return text

def count_words(text: str) -> int:
    # simple split with whitespace after claening
    text = text.strip()
    return 0 if not text else len(text.split())

def estimate_duration_seconds(words: int) -> float:
    return round(words / 2.2, 2)