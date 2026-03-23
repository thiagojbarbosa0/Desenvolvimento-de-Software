from __future__ import annotations

import json
import os
from typing import Any, Dict, Optional

from services.plan import generate_fallback_plan, default_motivational_phrase

try:
    from google import genai
except Exception:
    genai = None


def gemini_client() -> Optional[Any]:
    if genai is None:
        return None
    api_key = "(Sua_Chave_Aqui)"  # Chave hardcoded
    try:
        return genai.Client(api_key=api_key)
    except Exception:
        return None


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
        "summary",
        "daily_goal",
        "motivational_phrase",
        "breakfast",
        "lunch",
        "dinner",
        "snacks",
        "hydration",
        "shopping_list",
        "caution_notes",
        "crisis_support",
        "next_actions",
    ],
    "additionalProperties": False,
}


def generate_plan(profile: Dict[str, Any]) -> Dict[str, Any]:
    client = gemini_client()
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

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_json_schema": PLAN_SCHEMA,
            },
        )
        text = response.text or "{}"
        data = json.loads(text)
        return data
    except Exception:
        return generate_fallback_plan(profile)


def generate_motivational_message(profile: Dict[str, Any]) -> str:
    client = gemini_client()
    fallback = default_motivational_phrase(
        profile.get("goal", "Outro"),
        profile.get("motivations", ""),
        profile.get("name", "Você"),
    )
    if client is None:
        return fallback
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=(
                f"Crie uma frase curta, humana e motivadora para {profile.get('name')}, "
                f"que quer {profile.get('goal')}. Motivações: {profile.get('motivations')}."
            ),
        )
        text = (response.text or "").strip()
        return text[:220] if text else fallback
    except Exception:
        return fallback
