import pytest
from backend.plan import bmi, bmi_category, default_motivational_phrase, generate_fallback_plan
from backend.security import hash_password, verify_password

# ==========================================
# TESTES UNITÁRIOS PARA backend/plan.py
# ==========================================

def test_bmi_calculation_valid():
    """Testa o cálculo do IMC com valores válidos."""
    # Peso: 70kg, Altura: 175cm -> 70 / (1.75^2) = 22.857...
    resultado = bmi(175.0, 70.0)
    assert resultado is not None
    assert round(resultado, 2) == 22.86

def test_bmi_calculation_zero_or_negative_height():
    """Testa se o cálculo do IMC lida corretamente com alturas inválidas."""
    assert bmi(0, 70.0) is None
    assert bmi(-160, 70.0) is None

def test_bmi_calculation_exception_handling():
    """Testa se a função captura exceções (ex: passagem de strings inválidas)."""
    # Como a função tem um bloco try/except genérico que retorna None
    assert bmi("altura_invalida", 70.0) is None


@pytest.mark.parametrize("valor,categoria_esperada", [
    (None, "Sem dados"),
    (17.0, "Abaixo do peso"),
    (22.0, "Eutrofia"),
    (27.5, "Sobrepeso"),
    (32.0, "Obesidade I"),
    (37.0, "Obesidade II"),
    (42.0, "Obesidade III"),
])
def test_bmi_categories(valor, categoria_esperada):
    """Testa todas as faixas de classificação do IMC."""
    assert bmi_category(valor) == categoria_esperada


def test_default_motivational_phrase():
    """Testa a geração de frases motivacionais baseadas no objetivo do utilizador."""
    nome = "Ana"
    motivacao = "Ficar mais saudável"
    
    frase = default_motivational_phrase("Emagrecimento", motivacao, nome)
    
    assert nome in frase
    assert motivacao in frase
    assert "cada escolha de hoje conta" in frase

def test_default_motivational_phrase_empty_motivation():
    """Testa a frase motivacional quando o utilizador não fornece uma motivação extra."""
    frase = default_motivational_phrase("Ganho de massa muscular", "", "Bruno")
    assert "Você já começou." in frase


def test_generate_fallback_plan_emagrecimento():
    """Testa a estrutura do plano de contingência para o objetivo de Emagrecimento."""
    perfil_exemplo = {
        "name": "Carlos",
        "goal": "Emagrecimento",
        "sleep_hours": 8.0,
        "stress_level": 2,
        "motivations": "Ter mais energia"
    }
    
    plano = generate_fallback_plan(perfil_exemplo)
    
    assert "Carlos" in plano["summary"]
    assert "reduzir ultraprocessados" in plano["daily_goal"]
    assert "Iogurte natural com fruta" in plano["breakfast"]
    assert len(plano["shopping_list"]) > 0


# ==========================================
# TESTES UNITÁRIOS PARA backend/db.py
# ==========================================

def test_password_hashing_and_verification():
    """Testa se a password é cifrada corretamente e se a verificação funciona."""
    password_original = "MinhaSenhaSegura123"
    
    # Gera o hash
    hash_gerado = hash_password(password_original)
    
    # Garante que o hash não expõe a password em texto limpo
    assert hash_gerado != password_original
    assert "$" in hash_gerado
    
    # Verifica a password correta
    assert verify_password(password_original, hash_gerado) is True
    
    # Verifica uma password incorreta
    assert verify_password("SenhaErrada", hash_gerado) is False

def test_verify_password_invalid_format():
    """Testa o comportamento de verify_password com um hash malformado."""
    # Deve retornar False em vez de estourar uma exceção devido ao try/except interno
    assert verify_password("senha", "hash_sem_separador_dollar") is False