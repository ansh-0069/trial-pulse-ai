# TrialPulse AI

> An AI-powered dashboard for clinical trial operations that actually makes sense of your data.

## What is this?

We built TrialPulse AI to solve a real problem in clinical trials: **how do you keep track of 45+ sites without losing your mind?** 

This dashboard monitors trial sites in real-time, uses AI agents to spot problems before they blow up, and lets you ask questions in plain English instead of writing SQL queries at 2 AM.

## Cool stuff it does

**Multi-Agent Analysis**  
Think of it as having three really smart assistants working together:
- One watches data quality metrics 24/7
- Another digs into why sites are struggling (spoiler: it's usually staffing)
- A third one actually suggests what to do about it

**Digital Twin Map**  
See all your sites on an interactive globe. Green = good, yellow = watch this, red = someone needs to make a phone call.

**Natural Language Chat**  
Just ask "What's going on with Site 042?" instead of clicking through 17 dashboards. Powered by Google's Gemini AI.

**Command Center**  
All your KPIs in one place. Patient enrollment, data quality scores, and that database lock deadline everyone's stressed about.

## Tech we used

**Backend:** Python, FastAPI, Google Gemini API, Pandas  
**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Recharts

Nothing too exotic. We wanted it to actually work, not just look good in a slide deck.

## Getting it running

### What you'll need

- Python 3.8+ ([download here](https://www.python.org/downloads/))
- Node.js 18+ ([grab it here](https://nodejs.org/))
- A Google API key ([free from here](https://aistudio.google.com/app/apikey))

Quick check if you're ready:
```bash
python --version
node --version
npm --version
```

### Backend setup

```bash
cd backend

# Make a virtual environment (trust me, do this)
python -m venv venv

# Activate it
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install everything
pip install -r requirements.txt
```

Now create a `.env` file in the `backend` folder:
```env
GOOGLE_API_KEY=paste_your_actual_key_here
```

Don't skip this step or the chat feature won't work.

### Frontend setup

```bash
cd frontend
npm install
```

That's it. npm will handle the rest.

### Running both servers

You need two terminal windows open:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # if not already active
python main.py
```

You should see: `Uvicorn running on http://0.0.0.0:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Look for: `Local: http://localhost:5173/`

Open that URL in your browser and you're good to go.

## When things break

**"ModuleNotFoundError: No module named 'fastapi'"**  
You forgot to activate the virtual environment. Go back and run `venv\Scripts\activate`

**"GOOGLE_API_KEY is missing!"**  
The `.env` file either doesn't exist or has the wrong key. Double-check it's in the `backend` folder.

**"Port already in use"**  
Something else is running on that port. Either kill it or change the port in the code. Vite will auto-switch to 5174 if 5173 is taken.

**Chat not working / rate limit errors**  
We built in fallback responses for the demo. If you see backup answers, it means the API quota ran out but the app keeps working anyway.

## Project layout

```
TrialPulse-AI/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── agent_simulator.py   # The AI agents logic
│   ├── schema_generator.py  # Generates the site data
│   ├── data_loader.py       # Reads the Excel file
│   └── requirements.txt     # Python packages
│
├── frontend/
│   ├── src/
│   │   ├── views/           # Main pages (dashboard, map, agents, chat)
│   │   └── components/      # Reusable UI bits
│   └── package.json         # Node packages
│
└── README.md                # You are here
```

## Quick demo guide

1. **Command Center** - Check out the overall stats. Notice the database lock countdown? Yeah, that's intentional pressure.

2. **Digital Twin** - Click on Site 042 in LA. See that red marker? DQI score of 45 is bad news.

3. **Agent Workspace** - Hit "Run Analysis" on Site 042. Watch the agents figure out that the CRA quit and nobody replaced them.

4. **Chat Interface** - Ask it "Why is Site 042 struggling?" and see what happens.

## A few notes

- The data comes from a real clinical trial spreadsheet (`Study 1_Compiled_EDRR_updated.xlsx`)
- We're using 7 real sites + 38 simulated ones to make the map look populated
- Site 042 is intentionally broken for demo purposes (low DQI, staffing issues, the works)
- The AI has fallback responses so it won't crash during your presentation

## Built for Novartis Hackathon

We wanted to show how AI can actually help clinical operations teams instead of just being another buzzword. Hope you like it.
