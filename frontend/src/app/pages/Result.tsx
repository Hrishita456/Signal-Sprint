import { Link, useLocation, useNavigate } from "react-router";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

type PredictionResponse = {
  decision: number;
  label: string;
  summary: string;
  model_version: string;
};

type ResultLocationState = {
  image?: string;
  prediction?: PredictionResponse;
};

export function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as ResultLocationState | null) ?? null;
  const image = state?.image;
  const prediction = state?.prediction;

  useEffect(() => {
    if (!image || !prediction) {
      navigate("/upload");
    }
  }, [image, prediction, navigate]);

  if (!image || !prediction) {
    return null;
  }

  const statusConfig = prediction.decision === 1
    ? {
        label: prediction.label || "DMC Action Required",
        value: 1,
        icon: AlertCircle,
        bgClass: "bg-destructive",
        lightBgClass: "bg-destructive/10",
        textClass: "text-destructive",
        borderClass: "border-destructive",
        reasons: [prediction.summary],
      }
    : {
        label: prediction.label || "No Action Needed",
        value: 0,
        icon: CheckCircle2,
        bgClass: "bg-primary",
        lightBgClass: "bg-primary/10",
        textClass: "text-primary",
        borderClass: "border-primary",
        reasons: [prediction.summary],
      };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-muted/30 to-white px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT: Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Uploaded Image</h2>
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
              Upload Another Image
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
                  <div className="mb-1 text-sm text-white/80">Final Decision</div>
                  <div className="text-3xl font-bold text-white">{statusConfig.label}</div>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <div className="text-sm text-white/80">Binary Output:</div>
                <div className="text-5xl font-bold text-white">{statusConfig.value}</div>
              </div>
            </motion.div>

            {/* Confidence Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl bg-white p-8 shadow-xl"
            >
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-xl font-semibold text-foreground">Confidence Score</h3>
                <span className="text-2xl font-bold text-foreground">Not Provided</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className={`h-full ${statusConfig.bgClass}`}
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                The current backend returns binary decision output only (0 or 1).
              </p>
            </motion.div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl bg-white p-8 shadow-xl"
            >
              <h3 className="mb-4 text-xl font-semibold text-foreground">Explanation</h3>
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
                  <div className="text-muted-foreground">Analyzed At</div>
                  <div className="font-medium text-foreground">
                    {new Date().toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Model Version</div>
                  <div className="font-medium text-foreground">
                    {prediction.model_version || "Signal Sprint Model"}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
