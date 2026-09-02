#!/usr/bin/env python3
"""PostToolUse: al escribir/editar un route.ts bajo backend/app/api/, instruye
al modelo a invocar el subagente contract-fidelity-reviewer sobre ese archivo.
No ejecuta nada pesado -- solo decide el scope y emite la instruccion."""
import json
import sys


def in_scope(norm: str) -> bool:
    return norm.endswith("route.ts") and "/backend/app/api/" in norm


def main():
    payload = json.load(sys.stdin)
    file_path = payload.get("tool_input", {}).get("file_path", "")
    norm = file_path.replace("\\", "/")

    if not in_scope(norm):
        return

    file_name = norm.rsplit("/", 2)[-2] + "/" + norm.rsplit("/", 1)[-1]
    output = {
        "systemMessage": f"contract-fidelity-reviewer pendiente para {file_name}",
        "hookSpecificOutput": {
            "hookEventName": "PostToolUse",
            "additionalContext": (
                f"Acabas de escribir/editar {norm}. Antes de seguir con otra "
                "tarea, invoca el Agent tool con subagent_type "
                '"contract-fidelity-reviewer" sobre este archivo. Reporta los '
                "hallazgos al usuario; si no hay hallazgos, decilo explicito y "
                "segui."
            ),
        },
    }
    print(json.dumps(output))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
