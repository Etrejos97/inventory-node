#!/usr/bin/env python3
"""PreToolUse: bloquea ediciones al .env real del backend (DATABASE_URL)."""
import json
import sys

BLOCKED_SUFFIXES = ("backend/.env",)


def main():
    payload = json.load(sys.stdin)
    file_path = payload.get("tool_input", {}).get("file_path", "")
    norm = file_path.replace("\\", "/")

    if any(norm.endswith(suffix) for suffix in BLOCKED_SUFFIXES):
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    "Archivo de secretos reales (.env) -- edicion bloqueada por hook "
                    "de proyecto. Si necesitas cambiarlo, hacelo manualmente fuera de "
                    "Claude Code."
                ),
            }
        }
        print(json.dumps(output))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
