import pytest
import sys
import os

# Garante que o diretório raiz esteja no path para imports corretos
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))


@pytest.fixture(autouse=True)
def configurar_ambiente_mock(monkeypatch):
    """Injeta chave falsa antes de qualquer import de módulos que a exijam."""
    monkeypatch.setenv("GEMINI_API_KEY", "chave_falsa_para_o_ci")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///./test_nutriflow.db")

    # Remove módulos em cache para forçar re-importação com o env correto
    for mod in ["backend.ai", "backend.config"]:
        sys.modules.pop(mod, None)


def test_generate_plan_com_sucesso(mocker):
    from backend.ai import generate_plan
    from backend.schemas import ProfileCreate

    mock_text = (
        '{"summary": "Plano Mockado", "daily_goal": "Comer bem", '
        '"motivational_phrase": "Vai!", "breakfast": ["Tapioca"], '
        '"lunch": [], "dinner": [], "snacks": [], "hydration": "2L", '
        '"shopping_list": [], "caution_notes": [], '
        '"crisis_support": "Continue!", "next_actions": []}'
    )

    mocker.patch("backend.ai._get_client", return_value=mocker.Mock())
    mocker.patch("backend.ai._call_gemini", return_value=mock_text)

    perfil_teste = ProfileCreate(
        user_id="test-uuid",
        goal="Emagrecimento",
        weight_kg=80,
        height_cm=180,
        stress_level=3,
        age=30,
        biological_sex="Masculino",
        activity_level="Moderado",
        sleep_hours=7.0,
        sleep_minutes=0,
    )

    resultado = generate_plan(perfil_teste.dict())
    assert resultado["summary"] == "Plano Mockado"
    assert "Tapioca" in resultado["breakfast"]


def test_generate_chat_response_com_sucesso(mocker):
    from backend.ai import generate_chat_response

    mocker.patch("backend.ai._get_client", return_value=mocker.Mock())
    mocker.patch("backend.ai._call_gemini", return_value="Olá! Eu sou o NutriAI simulado.")

    resultado = generate_chat_response("Olá")
    assert resultado == "Olá! Eu sou o NutriAI simulado."


def test_generate_chat_response_sem_cliente(mocker):
    """Deve retornar mensagem de fallback quando Gemini não está disponível."""
    from backend.ai import generate_chat_response

    mocker.patch("backend.ai._get_client", return_value=None)

    resultado = generate_chat_response("Olá")
    assert "não está disponível" in resultado.lower()
