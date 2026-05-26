# NutriAI

App de nutrição com inteligência artificial que gera planos alimentares personalizados e oferece um consultor de saúde via chat.

---

## Tecnologias

**Backend**
- Python 3.13
- FastAPI
- SQLite
- Google Gemini 2.5 Flash

**Frontend**
- React 18 + Vite
- React Router DOM
- Axios

---

## Pré-requisitos

- Python 3.13+
- Node.js v18+
- Chave de API do Google Gemini

---

## Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/thiagojbarbosa0/Desenvolvimento-de-Software.git

cd Desenvolvimento-de-Software
```

### 2. Configurar a chave da API

Crie um arquivo `.env` na raiz do projeto com base no `backend/.env.example`:

```bash
cp backend/.env.example .env
```

Obtenha sua chave gratuitamente em: https://aistudio.google.com/apikey

> Crie a chave com uma conta Google pessoal e selecione "Create API key in new project".

Depois edite o .env e coloque sua chave após o texto "GEMINI_API_KEY=".

### 3. Criar ambiente virtual Python e instalar dependências do backend

```bash
python -m venv venv

source venv/bin/activate #Activate.ps1 no Windows

pip install -r requirements.txt
```

### 4. Instalar dependências do frontend

```bash
cd frontend

npm install

cd ..
```

---

## Rodando o projeto

O projeto precisa de **dois terminais abertos ao mesmo tempo**.

### Terminal 1 — Backend

Na raiz do projeto:

```bash
python -m uvicorn main:app --reload
```

Disponível em: http://127.0.0.1:8000

> Certifique-se que nenhum serviço está rodando na mesma porta.

### Terminal 2 — Frontend

```bash
cd frontend

npm run dev
```

Disponível em: http://localhost:5173

### Build para produção (frontend)

```bash
cd frontend

npm run build

npm run preview
```

---

## Estrutura do projeto

```
Desenvolvimento-de-Software/
├── main.py               # API FastAPI — endpoints
├── Pipfile               # Dependências Python
├── .env                  # Chave da API (não versionar)
├── backend/
│   ├── ai.py             # Integração com Google Gemini
│   ├── chat.py           # Lógica do consultor IA
│   ├── config.py         # Configurações e variáveis de ambiente
│   ├── db.py             # Banco de dados SQLite
│   ├── plan.py           # Geração de planos nutricionais
│   ├── seed.py           # Inicialização do banco com dados de exemplo
│   └── .env.example      # Modelo do arquivo .env
└── frontend/
    ├── src/
    │   ├── pages/        # Telas do app
    │   ├── assets/       # Componentes e fontes
    │   └── services/
    │       └── api.js    # Configuração do Axios
    └── package.json
```

---

## Modularização

O backend é organizado como um pacote Python (`backend/`), com cada módulo tendo responsabilidade única:

| Módulo | Responsabilidade |
|---|---|
| `main.py` | Ponto de entrada da API — define os endpoints e o servidor FastAPI |
| `backend/config.py` | Carrega variáveis de ambiente via pydantic-settings |
| `backend/db.py` | Toda a comunicação com o banco SQLite: criação de tabelas, queries e seed |
| `backend/ai.py` | Integração com a API do Google Gemini: cliente, geração de plano e mensagem motivacional |
| `backend/chat.py` | Lógica do chatbot NutriAI, com retry automático em caso de sobrecarga da API |
| `backend/plan.py` | Cálculo de IMC e geração de plano nutricional local (fallback sem IA) |
| `backend/seed.py` | Script avulso para inicializar o banco manualmente |

Os módulos se importam de forma hierárquica, sem dependências circulares:

```
main.py
 ├── backend.config
 ├── backend.db
 └── backend.chat
      └── backend.ai
           └── backend.plan
```

---

## Telas

| Rota         | Arquivo                      | Descrição              |
|--------------|------------------------------|------------------------|
| `/`          | `src/pages/TelaInicial.jsx`  | Home / Landing Page    |
| `/login`     | `src/pages/TelaLogin.jsx`    | Tela de login          |
| `/dashboard` | `src/pages/TelaPrincipal.jsx`| Dashboard + Chatbot    |

---

## Conexão frontend ↔ backend

A URL base da API está em `frontend/src/services/api.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:8000'
});
```

> Branch de integração: `feature/integracao-login`

---

## Usuários de exemplo

Criados automaticamente ao subir o projeto:

| Nome         | Email            | Senha |
|--------------|------------------|-------|
| Ana Souza    | ana@demo.com     | 1234  |
| Bruno Lima   | bruno@demo.com   | 1234  |
| Carla Mendes | carla@demo.com   | 1234  |

---

## Funcionalidades

- Cadastro e login de usuários
- Consultor de nutrição via chat com IA
- Geração de plano alimentar personalizado
- Fallback local caso a API do Gemini esteja indisponível


## Testes

Os testes devem ser preferencialmente realizados em ambiente virtual 
principalmente para a garantia de compatibilidade dos requisitos.
execute o seguinte comando:
```bash
pip install pytest passlib bcrypt pytest-mock && python -m pytest testes/testes_unitarios/test_nutriai_logic.py
