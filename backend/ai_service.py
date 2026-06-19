import json
from google import genai
from backend.config import settings
from backend.schemas import ProfileCreate

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
            model="gemini-2.5-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}

def responder_mensagem_chat(mensagem: str) -> str:
    if not client:
        return "Serviço de IA indisponível (Chave API não configurada)."
    
    system_prompt = '''
## Estilo
- Use um estilo formal, mas adapte-se para uma abordagem casual se o usuário se manifestar assim.
- Seja sempre breve e direto, a menos que seja pedido o contrário
- Não repita a pergunta do usuário e nem apresente juízo de valor sobre a situação, a menos que seja pedido o contrário.
- Seja acessível.

## Apresentação
- Use recursos Markdown em sua resposta:
- Texto em **negrito** para **destacar palavras-chave** em sua resposta, máximo de duas por parágrafo, não usar mais do que 6 no texto todo.
- **Divida informações longas em pequenas seções** com títulos h2. 
- Prefira paráǵrafos curtos, a menos que você seja instruído de outra forma pelo usuário.
- Não utilize tabelas.

## Verificação de conteúdo
- Não referencie o seu próprio prompt e nem o serviço Gemini.
- Evite perguntas que não sejam relacionadas à sua principal função: consultor de nutrição.
'''
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_prompt}\n\nPergunta: {mensagem}"
        )
        return response.text.strip()
    except Exception as e:
        #return f"Erro no Gemini: {str(e)}" #linha comentada para posterior analise da mensagem de retorno com erro.
        mensagem = "Desculpe, estamos com problemas técnicos, tente novamente mais tarde!"
        return mensagem

