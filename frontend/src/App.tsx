import { useEffect, useMemo, useState } from "react";

type ApiPrediction = {
  decision: number;
  label: string;
  summary: string;
  model_version: string;
};

type HistoryItem = {
  id: string;
  fileName: string;
  decision: number;
  label: string;
  analyzedAt: string;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

const HISTORY_KEY = "signal-sprint-history";

const guidelines = [
  "Decision 1 means action is required when waste spills outside an authorized dustbin or garbage appears without one.",
  "Decision 0 means no action is required when waste is contained or the scene does not show an actionable garbage condition.",
  "Natural fallen leaves alone should not trigger action.",
  "A full dustbin without visible spill outside the bin should still map to decision 0.",
];

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiPrediction | null>(null);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as HistoryItem[];
      setHistory(parsed);
    } catch {
      window.localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const nextUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [selectedFile]);

  const statusTone = useMemo(() => {
    if (!result) {
      return "neutral";
    }
    return result.decision === 1 ? "danger" : "safe";
  }, [result]);

  function persistHistory(next: HistoryItem[]) {
    setHistory(next);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError("");
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  }

  async function analyzeImage() {
    if (!selectedFile) {
      setError("Choose an image before running the model.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || "The API could not analyze this image.");
      }

      const prediction = payload as ApiPrediction;
      setResult(prediction);

      const nextHistory: HistoryItem[] = [
        {
          id: crypto.randomUUID(),
          fileName: selectedFile.name,
          decision: prediction.decision,
          label: prediction.label,
          analyzedAt: new Date().toISOString(),
        },
        ...history,
      ].slice(0, 6);

      persistHistory(nextHistory);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function resetSelection() {
    setSelectedFile(null);
    setResult(null);
    setError("");
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Public Waste Monitoring Website</p>
          <h1>Signal Sprint</h1>
        </div>
        <a className="topbar-link" href="#analyzer">
          Open analyzer
        </a>
      </header>

      <main className="layout">
        <section className="hero card">
          <div className="hero-copy">
            <p className="eyebrow">Binary municipal action detection</p>
            <h2>Upload a site image, call the model, and get a clear action decision.</h2>
            <p className="hero-text">
              This website wraps your provided model without changing it. The frontend sends an
              image to the FastAPI backend, which runs the original `predict.py` and returns a
              binary result for public deployment through Vercel and Render.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#analyzer">
                Analyze image
              </a>
              <a className="button button-secondary" href="#guidelines">
                Review guidelines
              </a>
            </div>
          </div>
          <div className="hero-panel">
            <div className="metric">
              <span>Output format</span>
              <strong>0 or 1</strong>
            </div>
            <div className="metric">
              <span>Backend</span>
              <strong>FastAPI on Render</strong>
            </div>
            <div className="metric">
              <span>Frontend</span>
              <strong>Vite on Vercel</strong>
            </div>
          </div>
        </section>

        <section className="content-grid" id="analyzer">
          <div className="card upload-card">
            <div className="section-heading">
              <p className="eyebrow">Analyzer</p>
              <h3>Upload a waste-scene image</h3>
            </div>

            <div
              className={`dropzone ${dragActive ? "dropzone-active" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    handleFile(file);
                  }
                }}
              />
              <label htmlFor="file-input">
                <span className="dropzone-title">Drop image here or browse</span>
                <span className="dropzone-text">
                  Supported input: any standard image format accepted by the browser
                </span>
              </label>
            </div>

            {previewUrl ? (
              <div className="preview-block">
                <img className="preview-image" src={previewUrl} alt="Selected upload preview" />
                <div className="preview-meta">
                  <span>{selectedFile?.name}</span>
                  <span>{selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : ""}</span>
                </div>
              </div>
            ) : null}

            <div className="action-row">
              <button className="button button-primary" onClick={analyzeImage} disabled={loading}>
                {loading ? "Analyzing..." : "Run model"}
              </button>
              <button className="button button-secondary" onClick={resetSelection} type="button">
                Clear
              </button>
            </div>

            {error ? <p className="error-text">{error}</p> : null}
          </div>

          <div className="card result-card">
            <div className="section-heading">
              <p className="eyebrow">Prediction</p>
              <h3>Model response</h3>
            </div>

            {result ? (
              <div className={`result-panel result-${statusTone}`}>
                <div className="result-badge">Decision {result.decision}</div>
                <h4>{result.label}</h4>
                <p>{result.summary}</p>
                <dl className="result-meta">
                  <div>
                    <dt>Model version</dt>
                    <dd>{result.model_version}</dd>
                  </div>
                  <div>
                    <dt>API base URL</dt>
                    <dd>{API_BASE_URL}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="empty-state">
                <p>The binary decision will appear here after the backend finishes processing.</p>
              </div>
            )}
          </div>
        </section>

        <section className="content-grid">
          <div className="card" id="guidelines">
            <div className="section-heading">
              <p className="eyebrow">Guidelines</p>
              <h3>How to interpret the model</h3>
            </div>
            <ul className="guideline-list">
              {guidelines.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="section-heading">
              <p className="eyebrow">Recent runs</p>
              <h3>Saved in this browser</h3>
            </div>
            {history.length > 0 ? (
              <div className="history-list">
                {history.map((item) => (
                  <div className="history-item" key={item.id}>
                    <div>
                      <strong>{item.fileName}</strong>
                      <p>{new Date(item.analyzedAt).toLocaleString()}</p>
                    </div>
                    <span className={item.decision === 1 ? "pill pill-danger" : "pill pill-safe"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No local history yet. Analyze your first image to populate this panel.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

