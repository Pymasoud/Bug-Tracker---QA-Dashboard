"""
AI-powered helper for suggesting bug severity levels.

This module talks to Anthropic's Claude model to classify the severity
of a bug based on its title and description.
"""

from __future__ import annotations

import os
from typing import Final

from anthropic import Anthropic
from dotenv import load_dotenv

# Load environment variables from the local .env file (if present).
load_dotenv()

# Name of the Claude model used for severity suggestions.
MODEL_NAME: Final[str] = "claude-haiku-4-5-20251001"


def suggest_severity(title: str, description: str) -> str:
    """
    Ask Claude to suggest a severity level ("High", "Medium", or "Low")
    based on the bug title and description.

    If any error occurs (missing API key, network issue, etc.), this
    function falls back to returning "Medium".
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        # Fallback if the API key is not configured.
        return "Medium"

    try:
        client = Anthropic(api_key=api_key)

        prompt = (
            "You are a bug severity classifier. Based on the bug title and description, \n"
            "respond with ONLY one word: High, Medium, or Low.\n\n"
            f"Bug Title: {title}\n"
            f"Bug Description: {description}\n\n"
            "Severity:"
        )

        message = client.messages.create(
            model=MODEL_NAME,
            max_tokens=10,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        # The response content is a list of content blocks; take the first text block.
        raw_text = ""
        if message.content:
            first_block = message.content[0]
            # Content blocks from Anthropic's client typically have a `.text` attribute.
            raw_text = getattr(first_block, "text", "") or ""

        severity = raw_text.strip().capitalize()

        # Normalize to one of the expected values if possible.
        if severity not in {"High", "Medium", "Low"}:
            return "Medium"

        return severity
    except Exception:
        # Any error (API, parsing, network) results in a safe default.
        return "Medium"

