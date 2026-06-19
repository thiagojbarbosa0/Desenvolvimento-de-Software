# NutriAI

App de nutrição com inteligência artificial que gera planos alimentares personalizados e oferece um consultor de saúde via chat.

### Deploy disponível em:
[![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)](https://nutri-ai-5n7n.onrender.com)

---

## Índice
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Como rodar localmente](#-como-rodar-localmente)
- [Deployment](#-deployment)
- [Testes](#-testes)

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
|🤖 **Consultor de IA** | Tire suas dúvidas ou peça dietas para o consultor com base no Gemini Flash 2.5 |
| 🏃 **Dietas personalizadas** | Crie dietas únicas para você de acordo em suas características e objetivos |
| 👭 **Comunidade real** | Interaja com outros usuários, expondo suas conquistas e recebendo apoio de outras pessoas |
| 📊 **Acompanhamento** | Acompanhe seu progresso por meio do dashboard interativo | 

---

## ⚒️ Tecnologias

**Frontend**
- React 18 + Vite
- React Router DOM
- Axios

**Backend**  
- Python 3.13
- Google Gemini 2.5 Flash
- FastAPI + Uvicorn (ASGI)

**Banco de Dados & Auth**
- JWT
- Pydantic
- SQLite
- SQLAlchemy

---

## 🏗️ Estrutura do projeto
```
├── backend/                  
│   ├── .env.example            # Modelo de .env para uso local
│   ├── chat.py                 # Funções de conversa com LLM
│   ├── config.py               # Configurações padrões do backend
│   ├── database.py             # Funções de gestão de BD
│   ├── models.py               # Modelos para BD
│   ├── plan.py                 # Funções de dieta com LLM
│   ├── schemas.py              # Esquemas padrões
│   └── security.py             # Criptografia de senha
│
├── frontend/
│   ├── src/
│   │   ├── assets/             # Fontes, ícones e imagens
│   │   ├── pages/              # Páginas do React e seus estilos
│   │   │   ├── Auth/
│   │   │   ├── Comunidade/
│   │   │   ├── ConsultorIA/
│   │   │   ├── Dashboard/
│   │   │   ├── Home/
│   │   │   ├── Main/
│   │   │   ├── MeuPerfil/
│   │   │   └── MinhaDieta/
│   │   ├── services/
│   │   │   └── api.js          # Conexão com o back via Axios
│   │   ├── App.jsx             # Definição das rotas
│   │   ├── index.css           # Estilo padrão da página
│   │   └── main.jsx            # Página estática do React
│   └── index.html
│
├── testes/                     # Testes com pytest
│   ├── testes_integracao/
│   └── testes_unitarios/
│
└── main.py                     # Definição de Endpoints
```

---

## 👀 Pré-requisitos

- Python 3.13+
- Node.js v18+
- Chave de API do Google Gemini

---

## 🧙 Como rodar localmente

### 1. Clonar o repositório

```bash
$ git clone https://github.com/thiagojbarbosa0/Desenvolvimento-de-Software.git

$ cd Desenvolvimento-de-Software
```

### 2. Configurar a chave da API do Gemini

Crie um arquivo `.env` na raiz do projeto com base no `backend/.env.example`:

```bash
$ cp backend/.env.example .env
```

> Obtenha sua chave gratuitamente em: https://aistudio.google.com/apikey
> Crie a chave com uma conta Google pessoal e selecione "Create API key in new project".

Depois edite o .env e coloque sua chave após o texto "GEMINI_API_KEY=". 
OBS: NÃO COLOQUE ESPAÇOS.

### 3. Criar ambiente virtual Python e instalar dependências do backend

```bash
$ python3 -m venv venv

$ source venv/bin/activate     # No Linux
$ source venv/bin/Activate.ps1     # No Windows

$ pip install -r requirements.txt
```

### 4. Iniciar serviço do Back-End
O comando a seguir deve ser executado na raíz do projeto:
```bash
$ python -m uvicorn main:app --host 0.0.0.0 --port 8000
``` 
Disponível em: http://localhost:8000. Mantenha o terminal aberto enquanto rodar o aplicativo.

> Certifique-se que nenhum serviço está rodando na mesma porta.

### 5. Instalar dependências do frontend
O projeto precisa de **dois terminais abertos ao mesmo tempo**.

Abra um novo terminal na raíz do projeto e execute os comandos:
```bash
$ cd frontend

$ npm install && npm run build
```

### 6. Iniciar serviço frontend
Na pasta frontend, execute:
```bash
$ npm run
```
O NutriAI estará disponível em: http://localhost:5173

---

## 🚀 Deployment
Para deployment do projeto, será necessário criar uma conta no [Render](https://render.com) gratuitamente e criar um projeto - por padrão o Render já cria o "My project" que pode ser utilizado aqui.

### 1. Backend
Dentro do projeto, crie um serviço do tipo "**Web Service**".

Conecte sua conta GitHub, selecione a aba "Public Git Repository", insira o link do repositório atual (https://github.com/thiagojbarbosa0/Desenvolvimento-de-Software) e clique em "**Connect**".

**Preenchendo as opções**
| Opção | Valor |
| --- | --- |
| **Name** | Como preferir (interfere na URL) |
| **Language** | Python 3 |
| **Branch** | main |
| **Region** | Como preferir |
| **Root Directory** | **Deixar vazia** |
| **Build Command** | pip install -r requirements.txt |
| **Start Command** | python -m uvicorn main:app --host 0.0.0.0 --port 8000 |
| **Instance Type** | Free (pode levar a maior tempo de resposta) |
| **Environment Variables** | **Deixar vazia** |

Expandir **Advanced** > **Secret Files**
"+ Add Secret File"

**Filename:** .env

**File Contents:**
```env
GEMINI_API_KEY=(SUA_CHAVE)
PRODUCTION_URL=(deixe vazia por enquanto)
```

Depois aperte em "**Deploy Web Service**"

Copie a URL do serviço.

### 2. Frontend
Dentro do projeto, crie um serviço do tipo "**Static Site**".

Selecione a aba "Public Git Repository", insira o link do repositório atual (https://github.com/thiagojbarbosa0/Desenvolvimento-de-Software) e clique em "**Connect**".

**Preenchendo as opções**
| Opção | Valor |
| --- | --- |
| **Name** | Como preferir (interfere na URL) |  
| **Branch** | main |
| **Root Directory** | frontend |
| **Build Command** | npm install && npm run build |
| **Publish Directory** | dist |
| **Environment Variables** | **Deixar vazia** |

Expandir **Advanced** > **Secret Files**
"+ Add Secret File"

**Filename:** .env

**File Contents:**
```env
VITE_BACKEND_URL=(ENDEREÇO DO SEU DEPLOY DO BACKEND **SEM O / NO FINAL**)
```
Depois aperte em "**Deploy Static Site**"

O NutriAI estará no ar e acessível pelo endereço informado no Render.

### 3. Ajuste final do Backend
Volte ao web service criado para o backend e acesse a opção lateral "**Environment**".

Em "**Secret Files**", clique em "**Edit**", acesse o conteúdo do .env e coloque o endereço do seu **frontend** (adquirido no passo anterior) após "PRODUCTION_URL=".

Após isso, basta reiniciar o deploy e o aplicativo estará 100% funcional.

---

## 🔬 Testes

Os testes devem ser preferencialmente realizados em ambiente virtual principalmente para a garantir a compatibilidade.

Dentro da pasta 'testes', execute os seguintes comandos:
```bash
$ pip install -r test_requirements.txt

$ python3 -m pytest testes_unitarios/test_nutriai_logic.py

$ python3 -m pytest testes_integracao/test_ai_service.py
```

---

## 👥 Equipe

<table align="center">
    <td align="center">
      <a href="https://github.com/giocmelo">
        <img src="https://avatars.githubusercontent.com/u/279556832?v=4" width="80px;" alt="Giovana"/><br>
        <sub><b>Giovana Castro</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Juaum-zim">
        <img src="https://avatars.githubusercontent.com/u/216450765?v=4" width="80px;" alt="João Pedro"/><br>
        <sub><b>João Pedro</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/paulancg">
        <img src="https://avatars.githubusercontent.com/u/161087458?v=4" width="80px;" alt="Paula"/><br>
        <sub><b>Paula Nóbrega</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/safn007">
        <img src="https://avatars.githubusercontent.com/u/236953714?v=4" width="80px;" alt="Samuel"/><br>
        <sub><b>Samuel Nascimento</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/thiagojbarbosa0">
        <img src="https://avatars.githubusercontent.com/u/248947271?v=4" width="80px;" alt="Thiago"/><br>
        <sub><b>Thiago José</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/UirajanJS">
        <img src="https://avatars.githubusercontent.com/u/248047712?v=4" width="80px;" alt="Uirajan"/><br>
        <sub><b>Uirajan José</b></sub>
      </a>
    </td>
  </tr>
</table>
