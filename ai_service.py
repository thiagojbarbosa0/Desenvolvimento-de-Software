import json
from google import genai
from ..config import settings
from ..schemas import ProfileCreate

client = None
if settings.gemini_api_key:
    client = genai.Client(api_key=settings.gemini_api_key)

def generate_nutritional_plan(profile: ProfileCreate) -> dict:
    if not client:
        # Fallback logic here (simulated)
        return {"summary": "Gemini API Key missing. Using basic plan.", "breakfast": ["Ovos", "Fruta"]}
    
    prompt = f"""
    Crie um plano nutricional para {profile.goal}.
    Dados: Peso {profile.weight_kg}kg, Altura {profile.height_cm}cm, Estresse {profile.stress_level}/5.
    Responda estritamente em JSON seguindo a estrutura:
    {{ "summary": "...", "daily_goal": "...", "breakfast": [], "lunch": [], "dinner": [], "snacks": [] }}
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}

def responder_mensagem_chat(mensagem: str) -> str:
    if not client:
        return "Serviço de IA indisponível (Chave API não configurada)."
    
    system_prompt = "Você é um consultor de nutrição chamado NutriAI. Responda em Português."
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"{system_prompt}\n\nPergunta: {mensagem}"
        )
        return response.text.strip()
    except Exception as e:
        return f"Erro no Gemini: {str(e)}"
