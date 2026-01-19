# 💻 GitHub Terminal Status Generator

A dynamic, terminal-style GitHub profile status generator that creates beautiful, real-time cards for your README.
*Um gerador dinâmico de status para o perfil do GitHub em estilo terminal que cria cartões incríveis e em tempo real para o seu README.*

---

<img src="https://github-terminal-readme.nexflare.com.br/api/stats/ryuuzera?theme=tokyonight&customstack=true&stacks=typescript,react,nextjs,nodejs,mongodb,tailwind,docker,python" />

---

## 🇺🇸 English Documentation

### ✨ Key Features

* **Terminal Aesthetic:** Modern IDE/Terminal design with typing animations.
* **Custom Tech Stack:** Display your favorite tools using [Devicons](https://devicon.dev/).
* **Modular Sections:** Show or hide profile, stats, core stack, and repositories.
* **10 Themes:** Choose from popular color schemes like Tokyo Night, Dracula, and more.

### ⚙️ Query Parameters

| Parameter | Description | Default | Options |
| --- | --- | --- | --- |
| `theme` | Terminal color scheme | `tokyonight` | See list below |
| `profile` | Show/hide user profile section | `true` | `true`, `false` |
| `stats` | Show/hide activity stats | `true` | `true`, `false` |
| `stack` | Show/hide core language bar | `true` | `true`, `false` |
| `repos` | Show/hide top repositories | `true` | `true`, `false` |
| `customstack` | Enable Devicon icons section | `false` | `true`, `false` |
| `stacks` | List of tech icons (slugs) | - | `react,typescript,nodejs...` |

---

### 🛠️ Devicon Integration

To display your tools in the **TECH STACK** section, use the icon names available in the official [Devicon](https://devicon.dev/) library. You must use the exact "slug" of the icon in the `stacks` parameter.

**Example:**
`stacks=react,nodejs,typescript,docker`

---

## 🇧🇷 Documentação em Português

### ✨ Funcionalidades Principais

* **Estética de Terminal:** Design baseado em sessões de terminal com animações de digitação.
* **Stack Personalizada:** Exiba suas ferramentas favoritas usando ícones do [Devicons](https://devicon.dev/).
* **Seções Modulares:** Ative ou desative perfil, estatísticas, linguagens e repositórios.
* **10 Temas:** Escolha entre esquemas de cores como Tokyo Night, Dracula e outros.

### ⚙️ Parâmetros de Consulta

| Parâmetro | Descrição | Padrão | Opções |
| --- | --- | --- | --- |
| `theme` | Esquema de cores | `tokyonight` | Ver lista abaixo |
| `profile` | Exibir/ocultar perfil do usuário | `true` | `true`, `false` |
| `stats` | Exibir/ocultar estatísticas | `true` | `true`, `false` |
| `stack` | Exibir/ocultar barra de linguagens | `true` | `true`, `false` |
| `repos` | Exibir/ocultar repositórios | `true` | `true`, `false` |
| `customstack` | Ativar seção de ícones Devicon | `false` | `true`, `false` |
| `stacks` | Lista de ícones (separados por vírgula) | - | `react,nextjs,docker...` |

---

### 🛠️ Integração Devicon

Para exibir suas ferramentas na seção **TECH STACK**, utilize os nomes dos ícones disponíveis na biblioteca oficial [Devicon](https://devicon.dev/). Você deve usar o "slug" exato do ícone no parâmetro `stacks`.

**Exemplo:**
`stacks=react,nodejs,typescript,docker`


## 🎨 Available Themes / Temas Disponíveis

Você pode usar qualquer um dos temas abaixo no parâmetro `theme`:

| Theme Name | Preview |
| --- | --- |
| `tokyonight` | Dark blue, purple, and green (Default) |
| `dracula` | Classic dark theme with pink and green accents |
| `monokai` | Retro terminal style with yellow and pink |
| `githubdark` | Official GitHub Dark mode colors |
| `githublight` | Official GitHub Light mode colors |
| `onedark` | Popular Atom-inspired dark theme |
| `onelight` | Clean light theme based on One Light |
| `solarizeddark` | Traditional Solarized Dark palette |
| `solarizedlight` | Traditional Solarized Light palette |
| `nightowl` | Deep blue theme by Sarah Drasner |


---

## 📄 License / Licença

This project is licensed under the MIT License.
*Este projeto está sob a licença MIT.*

---
