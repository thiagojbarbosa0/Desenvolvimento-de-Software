from __future__ import annotations

import json
import os

from db import (
    add_comment,
    all_posts,
    authenticate,
    create_post,
    create_user,
    get_profile,
    get_user_by_email,
    get_user_by_id,
    init_db,
    like_post,
    record_checkin,
    reset_streak,
    upsert_profile,
)
from ai import generate_motivational_message, generate_plan
from plan import bmi, bmi_category


APP_TITLE = "NutriFlow"


class NutriFlowApp:
    def __init__(self):
        self.state = {
            "screen": "welcome",
            "user_id": None,
            "draft_post": "",
            "draft_comment_open": {},
            "onboarding": {},
            "pending_login_email": "",
        }
        init_db()

    def run(self):
        while True:
            screen = self.state["screen"]
            if screen == "welcome":
                self.welcome_screen()
            elif screen == "demo":
                self.demo_screen()
            elif screen == "login":
                self.login_screen()
            elif screen == "register":
                self.register_screen()
            elif screen == "onboarding":
                if not self.state["user_id"]:
                    self.go("login")
                else:
                    self.onboarding_screen()
            elif screen == "app":
                self.app_screen()
            elif screen == "support":
                profile = get_profile(self.state["user_id"])
                if profile:
                    self.support_screen(profile)
                else:
                    self.go("onboarding")
            elif screen == "checkin":
                profile = get_profile(self.state["user_id"])
                if profile:
                    self.checkin_screen(profile)
                else:
                    self.go("onboarding")
            elif screen == "exit":
                break
            else:
                self.go("welcome")

    def go(self, screen: str):
        self.state["screen"] = screen

    def header(self):
        print(f"\n{APP_TITLE}")
        print("Protótipo em Python para simular o fluxo do app de nutrição.")

    def welcome_screen(self):
        self.header()
        print("\n### Abrir app → login/cadastro → onboarding → plano → uso diário")
        print("1. Entrar no app")
        print("2. Ver exemplos")
        print("3. Sair")
        choice = input("Escolha: ").strip()
        if choice == "1":
            self.go("login")
        elif choice == "2":
            self.go("demo")
        elif choice == "3":
            self.go("exit")
        else:
            print("Opção inválida.")

    def demo_screen(self):
        self.header()
        print("\nPerfis de exemplo")
        for email in ["ana@demo.com", "bruno@demo.com", "carla@demo.com"]:
            user = get_user_by_email(email)
            profile = get_profile(user["id"]) if user else None
            if user and profile:
                print(f"**{user['name']}** — {email}")
                print(f"Meta: {profile['goal']} | Sequência: {profile['streak_days']}")
                print("-" * 20)
        input("Pressione Enter para voltar.")
        self.go("welcome")

    def login_screen(self):
        self.header()
        print("\nFaça login")
        email = input("E-mail: ").strip()
        password = input("Senha: ").strip()
        print("1. Entrar")
        print("2. Criar conta")
        print("3. Voltar")
        choice = input("Escolha: ").strip()
        if choice == "1":
            user = authenticate(email, password)
            if user:
                self.state["user_id"] = user["id"]
                self.state["pending_login_email"] = email
                profile = get_profile(user["id"])
                self.go("onboarding" if profile is None else "app")
            else:
                print("Credenciais inválidas.")
        elif choice == "2":
            self.go("register")
        elif choice == "3":
            self.go("welcome")
        else:
            print("Opção inválida.")

    def register_screen(self):
        self.header()
        print("\nCadastre-se")
        name = input("Nome: ").strip()
        email = input("E-mail: ").strip()
        password = input("Senha: ").strip()
        confirm = input("Confirmar senha: ").strip()
        if not name or not email or not password:
            print("Preencha nome, e-mail e senha.")
        elif password != confirm:
            print("As senhas não coincidem.")
        else:
            if create_user(name, email, password):
                print("Conta criada.")
                self.state["pending_login_email"] = email
                self.go("login")
            else:
                print("Esse e-mail já existe.")
        input("Pressione Enter para voltar.")
        self.go("login")

    def onboarding_screen(self):
        self.header()
        print("\nOnboarding")
        print("Preencha os dados do usuário na ordem do fluxo. Depois o plano é gerado automaticamente.")

        user = get_user_by_id(self.state["user_id"])
        profile = get_profile(self.state["user_id"])
        prefill = dict(profile) if profile else {}
        state = self.state["onboarding"]

        name = input(f"Nome ({user['name'] if user else ''}): ").strip() or (user["name"] if user else "")
        age = int(input(f"Idade ({state.get('age', prefill.get('age', 25))}): ").strip() or state.get("age", prefill.get("age", 25)))
        bio_options = ["Feminino", "Masculino", "Intersexo", "Prefiro não informar"]
        print("Sexo biológico:")
        for i, opt in enumerate(bio_options, 1):
            print(f"{i}. {opt}")
        bio_choice = int(input("Escolha: ").strip()) - 1
        biological_sex = bio_options[bio_choice] if 0 <= bio_choice < len(bio_options) else "Feminino"
        height_cm = float(input(f"Altura (cm) ({state.get('height_cm', prefill.get('height_cm', 170.0))}): ").strip() or state.get("height_cm", prefill.get("height_cm", 170.0)))
        weight_kg = float(input(f"Peso atual (kg) ({state.get('weight_kg', prefill.get('weight_kg', 70.0))}): ").strip() or state.get("weight_kg", prefill.get("weight_kg", 70.0)))

        goal_options = ["Emagrecimento", "Ganho de massa muscular", "Controle de diabetes", "Melhora da saúde intestinal", "Melhora na energia e disposição", "Outro"]
        print("Quais são as suas principais metas?")
        for i, opt in enumerate(goal_options, 1):
            print(f"{i}. {opt}")
        goal_choice = int(input("Escolha: ").strip()) - 1
        goal = goal_options[goal_choice] if 0 <= goal_choice < len(goal_options) else "Emagrecimento"
        other_goal = input("Se marcou Outro, descreva: ").strip() if goal == "Outro" else ""
        objective = input("Objetivos que espera atingir: ").strip()
        motivations = input("Principais motivações: ").strip()

        dcnt = input("Possui alguma DCNT? (Não/Sim): ").strip().lower() == "sim"
        dcnt_details = input("Descreva detalhes: ").strip() if dcnt else ""

        activity_options = ["Sedentário", "Leve", "Moderado", "Intenso"]
        print("Nível de atividade física:")
        for i, opt in enumerate(activity_options, 1):
            print(f"{i}. {opt}")
        activity_choice = int(input("Escolha: ").strip()) - 1
        activity_level = activity_options[activity_choice] if 0 <= activity_choice < len(activity_options) else "Moderado"
        sleep_hours = int(input(f"Sono (horas) ({state.get('sleep_hours', prefill.get('sleep_hours', 7))}): ").strip() or state.get("sleep_hours", prefill.get("sleep_hours", 7)))
        sleep_minutes = int(input(f"Sono (minutos) ({state.get('sleep_minutes', prefill.get('sleep_minutes', 0))}): ").strip() or state.get("sleep_minutes", prefill.get("sleep_minutes", 0)))
        stress_level = int(input(f"Nível de estresse (1-5) ({state.get('stress_level', prefill.get('stress_level', 3))}): ").strip() or state.get("stress_level", prefill.get("stress_level", 3)))

        additional_details = input("Informações adicionais: ").strip()
        meal_preferences = input("Preferências alimentares: ").strip()

        onboarding = {
            "name": name,
            "age": age,
            "biological_sex": biological_sex,
            "height_cm": height_cm,
            "weight_kg": weight_kg,
            "goal": goal,
            "other_goal": other_goal,
            "objective": objective,
            "motivations": motivations,
            "dcnt": "Sim" if dcnt else "Não",
            "dcnt_details": dcnt_details,
            "activity_level": activity_level,
            "sleep_hours": sleep_hours,
            "sleep_minutes": sleep_minutes,
            "stress_level": stress_level,
            "additional_details": additional_details,
            "meal_preferences": meal_preferences,
        }
        plan = generate_plan(onboarding)
        onboarding["plan_json"] = plan
        upsert_profile(self.state["user_id"], onboarding)
        self.go("app")

    def render_home(self, user, profile):
        plan = json.loads(profile["plan_json"] or "{}") if profile and profile["plan_json"] else {}
        phrase = plan.get("motivational_phrase") or generate_motivational_message(
            {"name": user["name"], "goal": profile["goal"], "motivations": profile["motivations"]}
        )

        print(f"\n{phrase}")

        print(f"Meta do dia: {plan.get('daily_goal', 'Seguir o plano')}")
        print(f"Dias seguidos: {int(profile['streak_days'] or 0)}")
        bmi_value = bmi(float(profile["height_cm"] or 0), float(profile["weight_kg"] or 0))
        print(f"IMC: {bmi_value:.1f} — {bmi_category(bmi_value)}" if bmi_value else "IMC: —")

        print("1. Estou pensando em desistir")
        print("2. Fazer check-in")
        print("3. Reset do contador")
        print("4. Ver dieta")
        print("5. Comunidade")
        print("6. Perfil")
        print("7. Sair")
        choice = input("Escolha: ").strip()
        if choice == "1":
            self.go("support")
        elif choice == "2":
            self.go("checkin")
        elif choice == "3":
            reset_streak(self.state["user_id"])
            print("Contador reiniciado.")
        elif choice == "4":
            self.render_my_diet(profile)
        elif choice == "5":
            self.render_community(user)
        elif choice == "6":
            self.render_profile(user, profile)
        elif choice == "7":
            self.state["user_id"] = None
            self.go("welcome")
        else:
            print("Opção inválida.")

    def render_my_diet(self, profile):
        plan = json.loads(profile["plan_json"] or "{}") if profile and profile["plan_json"] else {}

        print(f"\nPlano: {plan.get('summary', 'Plano personalizado disponível.')}")
        print(f"Meta diária: {plan.get('daily_goal', 'Seguir o plano')}")
        print(f"Hidratação: {plan.get('hydration', 'Beba água ao longo do dia.')}")

        bmi_value = bmi(float(profile["height_cm"] or 0), float(profile["weight_kg"] or 0))
        if bmi_value:
            print(f"IMC: {bmi_value:.1f} — {bmi_category(bmi_value)}")

        print("Café da manhã:")
        for item in plan.get("breakfast", []):
            print(f"- {item}")
        print("Almoço:")
        for item in plan.get("lunch", []):
            print(f"- {item}")
        print("Jantar:")
        for item in plan.get("dinner", []):
            print(f"- {item}")
        print("Lanches:")
        for item in plan.get("snacks", []):
            print(f"- {item}")

        print(f"Lista de compras: {', '.join(plan.get('shopping_list', [])) or '—'}")

        print("Observações:")
        for note in plan.get("caution_notes", []):
            print(f"- {note}")

        input("Pressione Enter para voltar.")

    def render_community(self, user):
        print("\nComunidade")
        print("Postagens de usuários em situações similares.")

        content = input("Compartilhar postagem: ").strip()
        if content:
            create_post(user["name"], f"@{user['name'].split()[0].lower()}", content)
            print("Publicado.")

        for row in all_posts():
            comments = json.loads(row["comments_json"] or "[]")
            print(f"\n**{row['author_name']}** {row['author_tag'] or ''}")
            print(row["content"])

            print(f"1. Curtir ({row['likes']})")
            print("2. Comentar")
            print("3. Ver comentários")
            print("4. Próximo")
            choice = input("Escolha: ").strip()
            if choice == "1":
                like_post(row["id"])
                print("Curtido.")
            elif choice == "2":
                comment = input("Comentário: ").strip()
                if comment:
                    add_comment(row["id"], comment)
                    print("Comentado.")
            elif choice == "3":
                for comment in comments:
                    print(f"- {comment['text']} ({comment['created_at']})")
                input("Pressione Enter.")
            elif choice == "4":
                continue
            else:
                break

    def render_profile(self, user, profile):
        print("\nPerfil")
        print(f"Nome: {user['name']}")
        print(f"E-mail: {user['email']}")
        print(f"Meta: {profile['goal']}")
        print(f"DCNT: {profile['dcnt']} {('- ' + profile['dcnt_details']) if profile['dcnt_details'] else ''}")
        print(f"Atividade: {profile['activity_level']}")
        print(f"Sono: {profile['sleep_hours']}h {profile['sleep_minutes']}min")

        print("1. Editar onboarding")
        print("2. Sair")
        choice = input("Escolha: ").strip()
        if choice == "1":
            self.go("onboarding")
        elif choice == "2":
            self.state["user_id"] = None
            self.go("welcome")
        else:
            print("Opção inválida.")

    def support_screen(self, profile):
        plan = json.loads(profile["plan_json"] or "{}") if profile and profile["plan_json"] else {}
        print(f"\n{plan.get('crisis_support', 'Você não precisa acertar tudo hoje.')}")
        print(f"Por que começou: {profile['motivations'] or '—'}")
        print("Próximos passos:")
        for item in plan.get("next_actions", []):
            print(f"- {item}")
        input("Pressione Enter para voltar.")
        self.go("app")

    def checkin_screen(self, profile):
        print("\nCheck-in diário")
        mood = input("Como está hoje? (Muito bem/Bem/Neutro/Cansado/Desanimado): ").strip()
        notes = input("Nota rápida: ").strip()
        done = input("Cumpriu meta? (s/n): ").strip().lower() == "s"
        record_checkin(self.state["user_id"], mood, notes, done)
        print("Check-in salvo.")
        self.go("app")

    def app_screen(self):
        user = get_user_by_id(self.state["user_id"])
        profile = get_profile(self.state["user_id"])
        if not user:
            self.go("welcome")
            return

        self.header()
        print(f"\nOlá, {user['name']}")

        if not profile:
            print("Você ainda não tem perfil completo.")
            if input("Começar onboarding? (s/n): ").strip().lower() == "s":
                self.go("onboarding")
            return

        self.render_home(user, profile)


if __name__ == "__main__":
    app = NutriFlowApp()
    app.run()



if __name__ == "__main__":
    app = NutriFlowApp()
    app.run()
