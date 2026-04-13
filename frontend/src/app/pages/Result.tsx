import { Link, useLocation, useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { getHistoryItemById, updateHistoryItem, type StoredHistoryItem, type TicketStatus } from "../lib/history";
import { useI18n } from "../lib/i18n";

type PredictionResponse = {
  decision: number;
  label: string;
  summary: string;
  model_version: string;
};

type ResultLocationState = {
  historyId?: string;
  image?: string;
  prediction?: PredictionResponse;
};

export function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as ResultLocationState | null) ?? null;
  const historyId = state?.historyId;
  const image = state?.image;
  const prediction = state?.prediction;
  const [historyItem, setHistoryItem] = useState<StoredHistoryItem | null>(null);
  const [isWrongOpen, setIsWrongOpen] = useState(false);
  const { t, isHindi } = useI18n();

  useEffect(() => {
    if (!image || !prediction || !historyId) {
      navigate("/upload");
      return;
    }

    setHistoryItem(getHistoryItemById(historyId));
  }, [historyId, image, prediction, navigate]);

  if (!image || !prediction || !historyId) {
    return null;
  }

  const ticket = historyItem?.ticket;
  const feedback = historyItem?.feedback;

  const turnaroundText = useMemo(() => {
    if (!ticket?.resolvedAt) {
      return t("result.turnaroundOpen");
    }
    const ms = new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime();
    const hours = Math.max(0, Math.round((ms / (1000 * 60 * 60)) * 10) / 10);
    return `${hours}h`;
  }, [ticket?.createdAt, ticket?.resolvedAt, t]);

  const ticketStatusLabel = (status: TicketStatus) => {
    if (status === "Open") return t("ticket.open");
    if (status === "In Progress") return t("ticket.inProgress");
    return t("ticket.resolved");
  };

  const updateTicketStatus = (status: TicketStatus) => {
    if (!historyId) return;
    const nowIso = new Date().toISOString();

    const updated = updateHistoryItem(historyId, (item) => ({
      ...item,
      ticket: item.ticket
        ? {
            ...item.ticket,
            status,
            updatedAt: nowIso,
            resolvedAt: status === "Resolved" ? nowIso : item.ticket.resolvedAt,
          }
        : item.ticket,
    }));
    setHistoryItem(updated);
  };

  const saveFeedback = (correctedLabel: 0 | 1) => {
    if (!historyId) return;
    const nowIso = new Date().toISOString();
    const updated = updateHistoryItem(historyId, (item) => ({
      ...item,
      feedback: {
        isWrong: true,
        correctedLabel,
        updatedAt: nowIso,
      },
    }));
    setHistoryItem(updated);
    setIsWrongOpen(false);
  };

  const statusConfig = prediction.decision === 1
    ? {
        label: t("status.actionRequired"),
        value: 1,
        icon: AlertCircle,
        bgClass: "bg-destructive",
        lightBgClass: "bg-destructive/10",
        textClass: "text-destructive",
        borderClass: "border-destructive",
        reasons: [t("result.reason.action")],
      }
    : {
        label: t("status.noAction"),
        value: 0,
        icon: CheckCircle2,
        bgClass: "bg-primary",
        lightBgClass: "bg-primary/10",
        textClass: "text-primary",
        borderClass: "border-primary",
        reasons: [t("result.reason.noAction")],
      };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#e8f7f3] via-[#eef7ff] to-[#f6fbff] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT: Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-foreground">{t("result.uploadedImage")}</h2>
              <div className="overflow-hidden rounded-xl bg-muted">
                <img
                  src={image}
                  alt="Analyzed dustbin"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>

            <Link
              to="/upload"
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-white px-6 py-4 text-primary shadow-lg transition-all hover:bg-primary/5 hover:shadow-xl"
            >
              <Upload className="size-5" />
              {t("result.uploadAnother")}
            </Link>
          </motion.div>

          {/* RIGHT: Decision Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Big Decision Card */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              className={`overflow-hidden rounded-3xl ${statusConfig.bgClass} p-10 shadow-2xl`}
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <statusConfig.icon className="size-8 text-white" />
                </div>
                <div>
                  <div className="mb-1 text-sm text-white/80">{t("result.finalDecision")}</div>
                  <div className="text-3xl font-bold text-white">{statusConfig.label}</div>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <div className="text-sm text-white/80">{t("result.binaryInline")}</div>
                <div className="text-5xl font-bold text-white">{statusConfig.value}</div>
              </div>
            </motion.div>

            {/* Binary Output Detail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl bg-white p-8 shadow-xl"
            >
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-xl font-semibold text-foreground">{t("result.binaryLabel")}</h3>
                <span className="text-4xl font-bold text-foreground">{statusConfig.value}</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-muted/70">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: statusConfig.value === 1 ? "100%" : "45%" }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className={`h-full ${statusConfig.bgClass}`}
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {t("result.outputInterpretation")}
              </p>
            </motion.div>

            {/* Explanation */}
            {historyItem?.geoTag ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
                className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-8 shadow-xl"
              >
                <h3 className="mb-4 text-xl font-semibold text-foreground">{t("result.locationCoordinates")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="text-foreground">
                    <span className="font-semibold">{t("result.coordinates")}</span>{" "}
                    {historyItem.geoTag.latitude.toFixed(6)},{" "}
                    {historyItem.geoTag.longitude.toFixed(6)}
                  </div>
                  <div className="text-muted-foreground">{t("history.table.ward")}: {historyItem.geoTag.ward}</div>
                  <a
                    href={`https://maps.google.com/?q=${historyItem.geoTag.latitude},${historyItem.geoTag.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary/90"
                  >
                    {t("result.openInMaps")}
                  </a>
                </div>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl bg-white p-8 shadow-xl"
            >
              <h3 className="mb-4 text-xl font-semibold text-foreground">{t("result.explanation")}</h3>
              <ul className="space-y-3">
                {statusConfig.reasons.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`mt-1 size-2 shrink-0 rounded-full ${statusConfig.bgClass}`}
                    />
                    <span className="text-muted-foreground">{reason}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-2xl bg-muted/50 p-6"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">{t("result.analyzedAt")}</div>
                  <div className="font-medium text-foreground">
                    {new Date().toLocaleString(isHindi ? "hi-IN" : "en-US")}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">{t("result.modelVersion")}</div>
                  <div className="font-medium text-foreground">
                    {prediction.model_version || "Signal Sprint Model"}
                  </div>
                </div>
              </div>
            </motion.div>

            {ticket ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="rounded-2xl bg-white p-6 shadow-xl"
              >
                <h3 className="mb-4 text-xl font-semibold text-foreground">{t("result.autoTicket")}</h3>
                <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">{t("result.caseId")}</div>
                    <div className="font-semibold text-foreground">{ticket.caseId}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t("result.status")}</div>
                    <div className="font-semibold text-foreground">{ticketStatusLabel(ticket.status)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t("result.created")}</div>
                    <div className="font-semibold text-foreground">
                      {new Date(ticket.createdAt).toLocaleString(isHindi ? "hi-IN" : "en-US")}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">{t("result.turnaround")}</div>
                    <div className="font-semibold text-foreground">{turnaroundText}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["Open", "In Progress", "Resolved"] as TicketStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateTicketStatus(status)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        ticket.status === status
                          ? "bg-primary text-white"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {ticketStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="rounded-2xl bg-white p-6 shadow-xl"
            >
              <h3 className="mb-3 text-xl font-semibold text-foreground">{t("result.feedbackLoop")}</h3>
              {feedback?.isWrong ? (
                <p className="text-sm text-muted-foreground">
                  {t("result.correctSaved").replace("{label}", String(feedback.correctedLabel))}
                </p>
              ) : (
                <>
                  <button
                    onClick={() => setIsWrongOpen((prev) => !prev)}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    {t("result.modelWrong")}
                  </button>
                  {isWrongOpen ? (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => saveFeedback(0)}
                        className="rounded-lg bg-primary px-3 py-2 text-sm text-white"
                      >
                        {t("result.correct0")}
                      </button>
                      <button
                        onClick={() => saveFeedback(1)}
                        className="rounded-lg bg-destructive px-3 py-2 text-sm text-white"
                      >
                        {t("result.correct1")}
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
