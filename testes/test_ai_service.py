import pytest
import sys

# Criamos uma fixture para injetar a chave falsa ANTES de importar o código real
@pytest.fixture(autouse=True)
def configurar_ambiente_mock(monkeypatch):
    # Força a variável de ambiente que o SDK da Google caça na inicialização
    monkeypatch.setenv("GEMINI_API_KEY", "chave_falsa_para_o_ci")
    
    # Injeta também no seu objeto de configurações local, caso use pydantic-settings
    try:
        from config import settings
        monkeypatch.setattr(settings, "gemini_api_key", "chave_falsa_para_o_ci")
    except ImportError:
        pass # Se o arquivo config não estiver na raiz, o setenv acima já protege o SDK
    
    # Se o módulo já tiver sido importado por outro teste, removemos para forçar a reinicialização
    if 'ai_service' in sys.modules:
        del sys.modules['ai_service']

def test_generate_nutritional_plan_com_sucesso(mocker):
    # Adiciona o diretório pai ao sys.path para garantir o import correto dentro da pasta tests/
    import os
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    
    import ai_service
    from schemas import ProfileCreate

    # Criamos o Mock estruturado com a propriedade .text retornando a string JSON
    mock_response = mocker.Mock()
    mock_response.text = '{"summary": "Plano Mockado", "breakfast": ["Tapioca"], "lunch": [], "dinner": [], "snacks": []}'

    # Interceptamos a chamada no client do ai_service
    mocker.patch.object(ai_service.client.models, 'generate_content', return_value=mock_response)

    # Dados de teste fake para o Schema
    perfil_teste = ProfileCreate(goal="Hipertrofia", weight_kg=80, height_cm=180, stress_level=3)

    # Executamos a função
    resultado = ai_service.generate_nutritional_plan(perfil_teste)

    # Validamos se o seu código parseou o JSON com sucesso
    assert resultado["summary"] == "Plano Mockado"
    assert "Tapioca" in resultado["breakfast"]


def test_responder_mensagem_chat_com_sucesso(mocker):
    import ai_service

    # Mock simples de texto puro para o chat
    mock_response = mocker.Mock()
    mock_response.text = "Olá! Eu sou o NutriAI simulado."

    mocker.patch.object(ai_service.client.models, 'generate_content', return_value=mock_response)

    resultado = ai_service.responder_mensagem_chat("Olá")
    
    assert resultado == "Olá! Eu sou o NutriAI simulado."