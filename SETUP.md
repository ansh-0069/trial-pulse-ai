# TrialPulse AI - Setup Guide

Complete setup instructions for running TrialPulse AI locally.

## Prerequisites

Install these before starting:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org/) |
| **Python** | v3.8+ | [python.org](https://www.python.org/) |
| **Google Gemini API Key** | - | [ai.google.dev](https://ai.google.dev/) |

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo "GOOGLE_API_KEY=your_api_key_here" > .env
```

**Windows PowerShell:**
```powershell
Set-Content -Path ".env" -Value "GOOGLE_API_KEY=your_api_key_here"
```

### 2. Frontend Setup

```bash
cd ../frontend

# Install Node dependencies (use --legacy-peer-deps for React 19 compatibility)
npm install --legacy-peer-deps
```

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```
✅ Backend running at **http://localhost:8000**

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running at **http://localhost:5173**

### 4. Access Application

Open your browser: **http://localhost:5173**

## Project Structure

```
TrialPulse-AI/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # API keys (create this)
├── frontend/
│   ├── src/                 # React components
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Vite configuration
└── SETUP.md                 # This file
```

## Common Issues

| Issue | Solution |
|-------|----------|
| **TypeScript: "Cannot find type definition file for 'node'"** | Run `npm install --legacy-peer-deps` in `frontend/` |
| **Python: "ModuleNotFoundError: No module named 'google'"** | Run `pip install -r requirements.txt` in `backend/` |
| **npm: ERESOLVE error** | Add `--legacy-peer-deps` flag to npm install |
| **Backend: API key missing** | Create `backend/.env` with `GOOGLE_API_KEY=your_key` |

## Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

**Backend:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## What's NOT in Git (Automatically Excluded)

The `.gitignore` file excludes:
- ❌ `frontend/node_modules/` (333 packages, ~200MB)
- ❌ `backend/venv/` or `backend/__pycache__/`
- ❌ `backend/.env` and `frontend/.env` (API keys)
- ❌ `frontend/dist/` (build output)

**You must install dependencies after cloning!**

## Key Dependencies

**Backend (Python):**
- FastAPI, Uvicorn (web server)
- Google Generative AI (Gemini)
- Pandas, NumPy (data processing)

**Frontend (Node.js):**
- React 19, Vite (UI framework & build tool)
- TypeScript, Tailwind CSS (type safety & styling)
- Recharts, React Simple Maps (data visualization)
- Axios (API calls)


---

**Need help?** Check the Common Issues section above | **Ready?** Run `python main.py` (backend) + `npm run dev` (frontend)
