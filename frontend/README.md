# 🐛 BugTracker AI

A full-stack bug tracking web application with AI-powered severity suggestions using the Claude API.

![BugTracker AI](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20SQLite-6366F1?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Claude%20API-22D3EE?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)

---

## ✨ Features

- **Bug Management** — Create, view, update, and delete bugs
- **Status Tracking** — Open → In Progress → Fixed → Closed lifecycle
- **Priority Levels** — High / Medium / Low with color-coded badges
- **AI Severity Suggestions** — Claude API automatically analyzes each bug and suggests severity
- **Statistics Dashboard** — Charts showing bugs per sprint, bug type distribution, and status breakdown
- **Filter & Search** — Filter bugs by status and priority

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TailwindCSS |
| Backend | FastAPI (Python) |
| Database | SQLite + SQLAlchemy |
| AI | Anthropic Claude API |
| Charts | Recharts |
| Routing | React Router DOM |

---

## 📁 Project Structure

```
bug-tracker/
├── backend/
│   ├── main.py              # FastAPI app, all API routes
│   ├── models.py            # SQLAlchemy Bug model
│   ├── database.py          # SQLite connection & session
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── crud.py              # Database CRUD operations
│   ├── ai_service.py        # Claude API severity suggestion
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── bugApi.js         # All API calls to backend
│   │   ├── components/
│   │   │   ├── BugList.jsx       # Bug table component
│   │   │   ├── StatusBadge.jsx   # Status color badge
│   │   │   └── PriorityBadge.jsx # Priority color badge
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main bug list view
│   │   │   ├── AddBug.jsx        # Add new bug form
│   │   │   ├── BugDetails.jsx    # Single bug detail view
│   │   │   └── StatsPage.jsx     # Statistics & charts
│   │   ├── App.jsx               # Router setup
│   │   └── main.jsx              # React entry point
│   └── package.json
│
├── .env                     # API keys (never commit this!)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Anthropic API key ([Get one here](https://console.anthropic.com))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bug-tracker.git
cd bug-tracker
```

### 2. Set up the Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

Start the backend server:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at `http://localhost:8000`  
Interactive API docs at `http://localhost:8000/docs`

### 3. Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/bugs` | List all bugs (supports `?status=` and `?priority=` filters) |
| `POST` | `/bugs` | Create a new bug (returns AI severity suggestion) |
| `GET` | `/bugs/{id}` | Get a single bug by ID |
| `PUT` | `/bugs/{id}` | Update a bug (status, priority, etc.) |
| `DELETE` | `/bugs/{id}` | Delete a bug |
| `GET` | `/stats` | Get aggregated statistics |

---

## 🤖 How AI Severity Works

When you create a new bug, the app automatically:

1. Sends the bug **title** and **description** to the Claude API
2. Claude analyzes the content and returns **High**, **Medium**, or **Low**
3. The suggestion is saved alongside the bug and displayed in the UI

Example — a bug like *"App crashes on startup for all users"* will automatically receive **High** severity.

---

## 📊 Statistics Dashboard

The statistics page shows:

- **Total Bugs** — overall count
- **Open Bugs** — bugs not yet resolved
- **Fixed Bugs** — completed bugs
- **High Priority** — critical bugs requiring immediate attention
- **Bugs per Sprint** — bar chart showing workload distribution
- **Bugs by Type** — pie chart (crash, UI, performance, logic, security)
- **Bugs by Status** — bar chart showing lifecycle distribution

---

## 🗄 Data Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | Auto-incremented primary key |
| `title` | String | Short bug title |
| `description` | Text | Detailed bug description |
| `status` | Enum | `open`, `in_progress`, `fixed`, `closed` |
| `priority` | Enum | `high`, `medium`, `low` |
| `bug_type` | Enum | `crash`, `ui`, `performance`, `logic`, `security`, `other` |
| `sprint` | String | Sprint name (e.g. Sprint-1) |
| `ai_suggested_severity` | String | AI-generated severity (High/Medium/Low) |
| `created_at` | DateTime | Auto-set on creation |
| `updated_at` | DateTime | Auto-updated on change |

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude AI |

> ⚠️ Never commit your `.env` file to GitHub. It is already included in `.gitignore`.

---

## 📝 License

MIT License — feel free to use this project for learning or as a base for your own tools.

---

## 🙏 Built With

- [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
- [React](https://react.dev/) — Frontend UI library
- [Anthropic Claude](https://www.anthropic.com/) — AI severity classification
- [Recharts](https://recharts.org/) — Chart library for React
- [TailwindCSS](https://tailwindcss.com/) — Utility-first CSS framework
