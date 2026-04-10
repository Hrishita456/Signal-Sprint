# Signal Sprint

Signal Sprint is a public website for image-based waste monitoring. The frontend is a Vite + React app designed for Vercel, and the backend is a FastAPI service designed for Render. The provided model files are wrapped by the API and kept untouched inside `backend/model_artifacts/`.

## Project Structure

```text
Signal Sprint website/
├── backend/
│   ├── app/
│   ├── model_artifacts/
│   ├── requirements.txt
│   └── runtime.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vercel.json
└── render.yaml
```

## Local Development

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will run on `http://127.0.0.1:8000`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The website will run on `http://127.0.0.1:5173`.

## Environment Variables

### Backend

Create `backend/.env` if you want to customize local behavior:

```env
FRONTEND_ORIGINS=http://localhost:5173
MODEL_VERSION=Signal Sprint Model v1
```

### Frontend

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Deploy

### Render backend

1. Push this project to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Select the GitHub repo.
4. Render will detect `render.yaml`.
5. Create the service.
6. After the first deploy, open the service dashboard and set:
   - `FRONTEND_ORIGINS=https://your-vercel-domain.vercel.app`
7. Redeploy if Render asks for it.

Your backend URL will look like `https://signal-sprint-api.onrender.com`.

### Vercel frontend

1. In Vercel, import the same GitHub repo.
2. Set the root directory to `frontend`.
3. Confirm the framework is Vite.
4. Add an environment variable:
   - `VITE_API_BASE_URL=https://your-render-backend.onrender.com`
5. Deploy.

## Final Deployment Order

1. Deploy the backend on Render first.
2. Copy the Render backend URL.
3. Deploy the frontend on Vercel using that backend URL.
4. Copy the Vercel frontend URL.
5. Update Render `FRONTEND_ORIGINS` with the Vercel URL.
6. Redeploy the backend if needed.

## API Endpoints

- `GET /health` for health checks
- `POST /predict` with multipart field `file`

The prediction response includes a binary decision:

- `0` = no action required
- `1` = action required

