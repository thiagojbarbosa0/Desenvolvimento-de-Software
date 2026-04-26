# NutriFlow

Protótipo em Python/Streamlit para simular o fluxo do app de nutrição.

## Estrutura
- `app.py`: interface principal e navegação
- `db.py`: SQLite, autenticação, perfis, posts e check-ins
- `services/ai.py`: integração com Gemini 2.5 Flash e fallback local
- `seed.py`: cria dados de exemplo

## 🛠️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* **Python 3.9 ou superior**
* **Pip** (Gerenciador de pacotes do Python)

---

## 🚀 Configuração do Ambiente

Este projeto utiliza o **Pipenv** para gerenciar dependências e variáveis de ambiente de forma automática.

### 1. Instalar o Pipenv
Abra o seu terminal e instale o Pipenv globalmente:
```bash
pip install pipenv
```
### 2. Instalar as Dependências do Pipenv
Abra o seu terminal e digite:
```bash
python -m pipenv install
```

## 🔑 Configuração da API

Obtenha uma chave de API no Google AI Studio.

Na raiz do projeto, crie um arquivo chamado .env.

No arquivo, adicione: GEMINI_API_KEY=sua_chave_gerada.

OBS: Se não configurar a chave, o app continua funcionando com fallback local.

## Rodando o Programa
### Opções:
1. Abra seu terminal e digite:
```bash
python -m pipenv run py main.py
```
2. Clique no "Run Python File" dentro do arquivo main.py

## Usuários de exemplo
- email: ana@demo.com / senha: 1234
- email: bruno@demo.com / senha: 1234
- email: carla@demo.com / senha: 1234
