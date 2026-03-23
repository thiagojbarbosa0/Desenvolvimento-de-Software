# NutriFlow

Protótipo em Python/Streamlit para simular o fluxo do app de nutrição.

## Estrutura
- `app.py`: interface principal e navegação
- `db.py`: SQLite, autenticação, perfis, posts e check-ins
- `services/ai.py`: integração com Gemini 2.5 Flash e fallback local
- `seed.py`: cria dados de exemplo

## Rodar no Fedora
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY="SUA_CHAVE"
streamlit run app.py
```

Se não configurar a chave, o app continua funcionando com fallback local.

## Usuários de exemplo
- ana@demo.com / 1234
- bruno@demo.com / 1234
- carla@demo.com / 1234
