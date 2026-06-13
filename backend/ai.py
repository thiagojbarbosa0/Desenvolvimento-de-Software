"""
ai.py
Responsável por toda interação com a API do Gemini.
Inclui fallback local quando a chave não está disponível.
"""
from __future__ import annotations

import json
import time
from typing import Any, Dict, Optional

from backend.config import settings
from backend.plan import generate_fallback_plan, default_motivational_phrase

try:
    from google import genai
except ImportError:
    genai = None

_MAX_RETRIES = 3
_RETRY_DELAY = 2  # segundos

SYSTEM_PROMPT_CHAT = (
    "Você é um consultor de nutrição e saúde chamado NutriAI. "
    "Responda de forma clara, acolhedora e prática. "
    "Não dê diagnósticos médicos. "
    "Responda sempre em português."
)

PLAN_SCHEMA: Dict[str, Any] = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "daily_goal": {"type": "string"},
        "motivational_phrase": {"type": "string"},
        "breakfast": {"type": "array", "items": {"type": "string"}},
        "lunch": {"type": "array", "items": {"type": "string"}},
        "dinner": {"type": "array", "items": {"type": "string"}},
        "snacks": {"type": "array", "items": {"type": "string"}},
        "hydration": {"type": "string"},
        "shopping_list": {"type": "array", "items": {"type": "string"}},
        "caution_notes": {"type": "array", "items": {"type": "string"}},
        "crisis_support": {"type": "string"},
        "next_actions": {"type": "array", "items": {"type": "string"}},
    },
    "required": [
        "summary", "daily_goal", "motivational_phrase",
        "breakfast", "lunch", "dinner", "snacks",
        "hydration", "shopping_list", "caution_notes",
        "crisis_support", "next_actions",
    ],
    "additionalProperties": False,
}


def _get_client() -> Optional[Any]:
    """Retorna cliente Gemini ou None se indisponível."""
    if genai is None:
        return None
    api_key = settings.gemini_api_key
    if not api_key:
        print("[NutriAI] GEMINI_API_KEY não configurada — usando fallback local.")
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"[NutriAI] Erro ao criar cliente Gemini: {e}")
        return None


def _call_gemini(client: Any, contents: str, *, json_schema: Optional[dict] = None) -> Optional[str]:
    """
    Chama o Gemini com retry automático.
    Retorna o texto da resposta ou None em caso de falha persistente.
    """
    config: dict = {}
    if json_schema:
        config = {"response_mime_type": "application/json", "response_json_schema": json_schema}

    for attempt in range(1, _MAX_RETRIES + 1):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
                config=config if config else None,
            )
            text = (response.text or "").strip()
            return text if text else None
        except Exception as e:
            print(f"[NutriAI] Gemini erro (tentativa {attempt}/{_MAX_RETRIES}): {type(e).__name__}: {e}")
            if attempt < _MAX_RETRIES:
                time.sleep(_RETRY_DELAY)

    return None


def generate_plan(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Gera plano nutricional via Gemini; cai no fallback se necessário."""
    client = _get_client()
    if client is None:
        return generate_fallback_plan(profile)

    prompt = f"""
Crie um plano nutricional inicial, prático, acolhedor e seguro para um app de nutrição.

Perfil:
- Nome: {profile.get('name')}
- Idade: {profile.get('age')}
- Sexo biológico: {profile.get('biological_sex')}
- Altura: {profile.get('height_cm')} cm
- Peso: {profile.get('weight_kg')} kg
- Meta: {profile.get('goal')}
- Outro objetivo: {profile.get('other_goal')}
- DCNT/condição: {profile.get('dcnt')} | detalhes: {profile.get('dcnt_details')}
- Atividade física: {profile.get('activity_level')}
- Sono: {profile.get('sleep_hours')} h {profile.get('sleep_minutes')} min
- Estresse: {profile.get('stress_level')}/5
- Motivações: {profile.get('motivations')}
- Objetivo esperado: {profile.get('objective')}
- Observações adicionais: {profile.get('additional_details')}
- Preferências alimentares: {profile.get('meal_preferences')}

Regras:
- Não use linguagem alarmista.
- Seja específico e fácil de seguir.
- Traga opções simples e reais.
- Inclua mensagem para quando a pessoa pensar em desistir.
- Responda somente em JSON válido, seguindo o schema.
"""

    text = _call_gemini(client, prompt, json_schema=PLAN_SCHEMA)
    if text:
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            print("[NutriAI] JSON inválido na resposta do plano — usando fallback.")

    return generate_fallback_plan(profile)


def generate_chat_response(mensagem: str) -> str:
    """Responde a uma mensagem de chat via Gemini; cai no fallback se necessário."""
    client = _get_client()
    if client is None:
        return "Desculpe, o serviço de IA não está disponível no momento."

    contents = f"{SYSTEM_PROMPT_CHAT}\n\nPergunta do usuário: {mensagem}"
    text = _call_gemini(client, contents)

    if text:
        return text[:2000]  # limita tamanho da resposta

    return "O serviço de IA está temporariamente sobrecarregado. Aguarde alguns instantes e tente novamente."
