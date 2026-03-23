from __future__ import annotations

from typing import Any, Dict, List, Optional


def bmi(height_cm: float, weight_kg: float) -> Optional[float]:
    try:
        height_m = height_cm / 100.0
        if height_m <= 0:
            return None
        return weight_kg / (height_m * height_m)
    except Exception:
        return None


def bmi_category(value: Optional[float]) -> str:
    if value is None:
        return "Sem dados"
    if value < 18.5:
        return "Abaixo do peso"
    if value < 25:
        return "Eutrofia"
    if value < 30:
        return "Sobrepeso"
    if value < 35:
        return "Obesidade I"
    if value < 40:
        return "Obesidade II"
    return "Obesidade III"


def default_motivational_phrase(goal: str, motivation: str, name: str) -> str:
    mapping = {
        "Emagrecimento": "cada escolha de hoje conta para a sua meta de amanhã",
        "Ganho de massa muscular": "consistência vale mais do que perfeição",
        "Controle de diabetes": "pequenas decisões estáveis protegem sua saúde",
        "Melhora da saúde intestinal": "seu intestino responde à regularidade",
        "Melhora na energia e disposição": "sua rotina pode virar combustível",
        "Outro": "passos pequenos também constroem grandes resultados",
    }
    core = mapping.get(goal, "sua consistência transforma o processo")
    motivation = (motivation or "").strip()
    extra = f" {motivation}" if motivation else " Você já começou."
    return f"{name}, lembre-se: {core}.{extra}"


def generate_fallback_plan(profile: Dict[str, Any]) -> Dict[str, Any]:
    name = profile.get("name", "Você")
    goal = profile.get("goal", "Outro")
    sleep_h = float(profile.get("sleep_hours", 7.0) or 7.0)
    stress = int(profile.get("stress_level", 3) or 3)

    if goal == "Emagrecimento":
        breakfast = ["Iogurte natural com fruta", "Ovos mexidos com pão integral", "Aveia com chia"]
        lunch = ["Arroz + feijão + frango grelhado + salada", "Metade do prato com vegetais", "Trocar fritura por assado"]
        dinner = ["Sopa com proteína", "Omelete com legumes", "Salada reforçada + proteína"]
        snacks = ["Fruta", "Castanhas em porção pequena", "Iogurte"]
        daily = "reduzir ultraprocessados e manter refeições previsíveis"
    elif goal == "Ganho de massa muscular":
        breakfast = ["Ovos + aveia", "Iogurte + banana + pasta de amendoim", "Sanduíche com proteína"]
        lunch = ["Arroz, feijão, carne magra e legumes", "Macarrão com proteína", "Batata + frango + salada"]
        dinner = ["Tapioca com ovos", "Arroz + proteína", "Wrap com frango e vegetais"]
        snacks = ["Vitamina com leite e fruta", "Queijo + fruta", "Iogurte + granola"]
        daily = "manter superávit leve e proteína em todas as refeições"
    elif goal == "Controle de diabetes":
        breakfast = ["Aveia com sementes", "Ovos e pão integral", "Iogurte sem açúcar com fruta"]
        lunch = ["Arroz integral, feijão, proteína e legumes", "Metade do prato de vegetais", "Evitar bebidas açucaradas"]
        dinner = ["Sopa de legumes com proteína", "Omelete com salada", "Prato leve sem açúcar"]
        snacks = ["Frutas com casca quando possível", "Castanhas", "Iogurte sem açúcar"]
        daily = "priorizar fibras, regularidade e menor carga glicêmica"
    elif goal == "Melhora da saúde intestinal":
        breakfast = ["Iogurte natural + frutas", "Aveia + chia", "Pão integral com ovos"]
        lunch = ["Legumes + arroz + feijão + proteína", "Salada variada", "Fibras distribuídas no dia"]
        dinner = ["Sopa com vegetais", "Omelete com legumes", "Refeição leve e mastigada com calma"]
        snacks = ["Frutas", "Kefir/iogurte", "Sementes"]
        daily = "aumentar fibras e água de forma gradual"
    else:
        breakfast = ["Fruta + proteína", "Pão integral com ovos", "Iogurte com aveia"]
        lunch = ["Prato equilibrado com proteína, carboidrato e vegetais", "Arroz, feijão e legumes", "Almoço simples e repetível"]
        dinner = ["Jantar leve, mas completo", "Sopa ou omelete", "Refeição prática"]
        snacks = ["Fruta", "Iogurte", "Oleaginosas em pequena porção"]
        daily = "seguir uma rotina sustentável e realista"

    return {
        "summary": f"Plano inicial para {name}, com foco em {goal.lower()} e rotina possível de manter.",
        "daily_goal": daily,
        "motivational_phrase": default_motivational_phrase(goal, profile.get("motivations", ""), name),
        "breakfast": breakfast,
        "lunch": lunch,
        "dinner": dinner,
        "snacks": snacks,
        "hydration": "Meta-base: 30 a 35 ml por kg ao dia, ajustando conforme atividade, calor e orientação profissional.",
        "shopping_list": ["Frutas", "Proteína magra", "Legumes e verduras", "Aveia", "Iogurte natural", "Feijão ou leguminosas"],
        "caution_notes": [
            f"Sono informado: {sleep_h} h.",
            f"Estresse informado: {stress}/5.",
            "Se houver DCNT, valide o plano com profissional de saúde.",
        ],
        "crisis_support": "Hoje não precisa ser perfeito. Faça a próxima refeição ser apenas um pouco melhor que a anterior.",
        "next_actions": [
            "Beba água nas próximas 2 horas.",
            "Escolha uma refeição base para repetir amanhã.",
            "Marque uma vitória pequena no check-in diário.",
        ],
    }
