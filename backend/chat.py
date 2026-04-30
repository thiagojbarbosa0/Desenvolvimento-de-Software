from __future__ import annotations
import time
from typing import Optional
from backend.ai import gemini_client

SYSTEM_PROMPT = (
    "Você é um consultor de nutrição e saúde chamado NutriAI. "
    "Responda de forma clara, acolhedora e prática. "
    "Não dê diagnósticos médicos. "
    "Responda sempre em português."
)

_MAX_RETRIES = 3
_RETRY_DELAY = 2  # segundos entre tentativas


def responder_mensagem(mensagem: str) -> str:
    client = gemini_client()
    if client is None:
        print("CLIENTE GEMINI É NONE")
        return "Desculpe, o serviço de IA não está disponível no momento."

    for tentativa in range(1, _MAX_RETRIES + 1):
        try:
            print(f"Enviando para Gemini (tentativa {tentativa}): {mensagem}")
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"{SYSTEM_PROMPT}\n\nPergunta do usuário: {mensagem}",
            )
            print(f"Resposta recebida: {response.text}")
            texto = (response.text or "").strip()
            return texto if texto else "Não consegui gerar uma resposta. Tente novamente."
        except Exception as e:
            print(f"ERRO GEMINI DETALHADO (tentativa {tentativa}): {type(e).__name__}: {e}")
            if tentativa < _MAX_RETRIES:
                time.sleep(_RETRY_DELAY)

    return "O serviço de IA está temporariamente sobrecarregado. Aguarde alguns instantes e tente novamente."
