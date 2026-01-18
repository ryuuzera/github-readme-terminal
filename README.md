# 💻 GitHub Terminal Status Generator

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)

A dynamic, terminal-style GitHub profile status generator that creates beautiful, real-time SVG cards for your README.
*Um gerador dinâmico de status para o perfil do GitHub em estilo terminal que cria cartões SVG incríveis e em tempo real para o seu README.*

---

## 🇺🇸 English Documentation

### 📝 Project Description
This project is a serverless SVG generator that renders your GitHub open-source journey as a realistic terminal session. It fetches real-time data directly from the GitHub GraphQL API to display contribution graphs, repository stats, and your core tech stack.

### ✨ Key Features
* **Terminal Aesthetic:** Designed to look like a modern IDE/Terminal session with typing animations.
* **Visual Analytics:** Includes a custom SVG area chart representing your yearly contribution activity.
* **Theme Support:** Built-in support for popular themes: `tokyonight`, `dracula`, and `monokai`.
* **Live Data:** Fetches up-to-the-minute accuracy using GitHub GraphQL API.

### 🚀 How to Use
Add the following markdown to your GitHub profile README:

```markdown
![GitHub Terminal Status](https://github-terminal-readme.nexflare.com.br/api/stats/ryuuzera?theme=tokyonight)

```

**Query Parameters:**
| Parameter | Description | Options |
| :--- | :--- | :--- |
| `theme` | Color scheme of the terminal | `tokyonight` (default), `dracula`, `monokai` |

---

## 🇧🇷 Documentação em Português

### 📝 Descrição do Projeto

Este projeto é um gerador de SVG serverless que renderiza sua jornada open-source no GitHub como uma sessão de terminal realista. Ele busca dados em tempo real diretamente da API GraphQL do GitHub para exibir gráficos de contribuição, estatísticas de repositórios e sua stack principal.

### ✨ Funcionalidades Principais

* **Estética de Terminal:** Design baseado em sessões de terminal/IDE modernas com animações de digitação.
* **Análise Visual:** Inclui um gráfico de área (wave-chart) representando sua atividade de contribuição anual.
* **Suporte a Temas:** Temas integrados: `tokyonight`, `dracula` e `monokai`.
* **Dados em Tempo Real:** Precisão garantida via API GraphQL do GitHub.

### 🚀 Como Usar

Adicione o seguinte markdown ao seu README de perfil do GitHub:

```markdown
![GitHub Terminal Status](https://github-terminal-readme.nexflare.com.br/api/stats/ryuuzera?theme=tokyonight)

```

**Parâmetros de Consulta:**
| Parâmetro | Descrição | Opções |
| :--- | :--- | :--- |
| `theme` | Esquema de cores do terminal | `tokyonight` (padrão), `dracula`, `monokai` |

---

## 🛠️ Installation & Setup / Instalação

1. **Clone the repository / Clone o repositório:**
```bash
git clone [https://github.com/ryuuzera/github-readme-terminal.git](https://github.com/ryuuzera/github-readme-terminal.git)

```

2. **Install dependencies / Instale as dependências:**
```bash
npm install

```

3. **Environment Variables / Variáveis de Ambiente:**
Create a `.env.local` file and add your GitHub Personal Access Token:
*Crie um arquivo `.env.local` e adicione seu Token de Acesso Pessoal do GitHub:*
```env
GITHUB_TOKEN=your_personal_access_token_here

```

4. **Run locally / Rode localmente:**
```bash
npm run dev

```

---

## 📄 License / Licença

This project is licensed under the MIT License.
*Este projeto está sob a licença MIT.*


