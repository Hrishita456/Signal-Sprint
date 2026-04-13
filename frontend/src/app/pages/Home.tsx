import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, CheckCircle2, Cpu, Upload, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { readHistory, type StoredHistoryItem } from "../lib/history";
import { useI18n } from "../lib/i18n";

export function Home() {
  const [historyData, setHistoryData] = useState<StoredHistoryItem[]>([]);
  const { t, isHindi } = useI18n();

  useEffect(() => {
    setHistoryData(readHistory());
  }, []);

  const latestAction = useMemo(
    () => historyData.find((item) => item.result === 1) ?? historyData[0] ?? null,
    [historyData],
  );
  const recentActivity = useMemo(() => historyData.slice(0, 3), [historyData]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#e8f7f3] via-[#eef7ff] to-[#f6fbff] px-6 py-14">
      <div className="mx-auto max-w-7xl space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-white/80 bg-white/60 p-10 text-center shadow-xl backdrop-blur"
        >
          <div className="relative mx-auto mb-8 flex h-52 w-52 items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.2, 0.45] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-[#8dd7ff]/45"
            />
            <motion.div
              animate={{ scale: [0.9, 1.04, 0.9], opacity: [0.4, 0.2, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut", delay: 0.2 }}
              className="absolute inset-4 rounded-full bg-[#66c6ff]/45"
            />
            <div className="relative z-10 flex size-36 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#3bc7d8] shadow-2xl shadow-primary/30">
              <Upload className="size-16 text-white" />
            </div>
          </div>

          <h1 className="mb-4 text-6xl font-bold text-foreground">{t("home.title")}</h1>
          <p className="mx-auto mb-8 max-w-3xl text-2xl text-muted-foreground">
            {t("home.subtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/upload"
              className="inline-flex items-center gap-3 rounded-2xl bg-primary px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40"
            >
              <Upload className="size-6" />
              {t("home.uploadImage")}
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-3 rounded-2xl border-2 border-primary bg-white px-10 py-4 text-lg font-semibold text-primary shadow-sm transition-all hover:bg-primary/5"
            >
              {t("home.recentActivityButton")}
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-6 text-center"
        >
          <p className="text-lg font-medium text-foreground">
            {t("home.sustainability")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-3xl border border-white/80 bg-white/65 p-10 shadow-xl backdrop-blur"
        >
          <h2 className="mb-2 text-center text-5xl font-bold text-foreground">{t("home.howItWorks")}</h2>
          <p className="mb-8 text-center text-xl text-muted-foreground">
            {t("home.howItWorksSub")}
          </p>
          <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
            <div className="rounded-2xl bg-muted/65 p-6 text-center">
              <Upload className="mx-auto mb-3 size-10 text-primary" />
              <h3 className="text-2xl font-semibold text-foreground">{t("home.step.upload")}</h3>
              <p className="text-muted-foreground">{t("home.step.uploadDesc")}</p>
            </div>
            <ArrowRight className="mx-auto hidden size-7 text-muted-foreground md:block" />
            <div className="rounded-2xl bg-muted/65 p-6 text-center">
              <Cpu className="mx-auto mb-3 size-10 text-primary" />
              <h3 className="text-2xl font-semibold text-foreground">{t("home.step.ai")}</h3>
              <p className="text-muted-foreground">{t("home.step.aiDesc")}</p>
            </div>
            <ArrowRight className="mx-auto hidden size-7 text-muted-foreground md:block" />
            <div className="rounded-2xl bg-muted/65 p-6 text-center">
              <CheckCircle2 className="mx-auto mb-3 size-10 text-primary" />
              <h3 className="text-2xl font-semibold text-foreground">{t("home.step.decision")}</h3>
              <p className="text-muted-foreground">{t("home.step.decisionDesc")}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-3xl border border-white/80 bg-white/65 p-10 shadow-xl backdrop-blur"
        >
          <h2 className="text-center text-5xl font-bold text-foreground">{t("home.seeInAction")}</h2>
          <p className="mb-8 mt-2 text-center text-xl text-muted-foreground">
            {t("home.seeInActionSub")}
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl bg-muted">
              {latestAction ? (
                <img
                  src={latestAction.thumbnail}
                  alt="Latest action-required"
                  className="h-full min-h-72 w-full object-cover"
                />
              ) : (
                <div className="flex min-h-72 items-center justify-center px-4 text-center text-muted-foreground">
                  {t("home.latestAnalyzeHint")}
                </div>
              )}
            </div>
            <div className="rounded-2xl bg-destructive p-8 text-white">
              <div className="mb-2 text-lg text-white/85">{t("home.latestActionTitle")}</div>
              <h3 className="mb-4 text-4xl font-bold">
                {latestAction?.result === 1 ? t("home.latestActionRequired") : t("home.latestNoAction")}
              </h3>
              <div className="mb-4 text-xl">
                {t("home.latestBinary")} <span className="text-5xl font-bold">{latestAction?.result ?? 0}</span>
              </div>
              <p className="text-white/90">
                {latestAction
                  ? t("home.latestPoweredBy")
                  : t("home.latestNoData")}
              </p>
              {latestAction?.geoTag ? (
                <div className="mt-4 rounded-xl bg-white/20 px-4 py-3 text-sm">
                  {t("home.ward")}: {latestAction.geoTag.ward} · {latestAction.geoTag.latitude.toFixed(6)},{" "}
                  {latestAction.geoTag.longitude.toFixed(6)}
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#09b89d] to-[#1c70f0] p-10 text-center text-white shadow-2xl"
        >
          <h2 className="mb-2 text-5xl font-bold">{t("home.startNow")}</h2>
          <p className="mb-7 text-2xl text-white/90">
            {t("home.startNowSub")}
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-4 text-2xl font-semibold text-primary shadow-lg transition-transform hover:scale-[1.02]"
          >
            <Upload className="size-6" />
            {t("home.uploadNow")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="rounded-3xl border border-white/80 bg-white/65 p-8 shadow-xl backdrop-blur"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-4xl font-bold text-foreground">{t("home.recentActivity")}</h2>
            <Link to="/history" className="text-xl font-semibold text-primary hover:underline">
              {t("home.viewAll")}
            </Link>
          </div>

          {recentActivity.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-white">
                  <div className="relative h-44 overflow-hidden">
                    <img src={item.thumbnail} alt="Recent detection" className="size-full object-cover" />
                    <div
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-sm font-semibold text-white ${
                        item.result === 1 ? "bg-destructive" : "bg-primary"
                      }`}
                    >
                      {item.result === 1 ? t("home.badge.action") : t("home.badge.clear")}
                    </div>
                  </div>
                  <div className="space-y-1 px-4 py-3 text-sm text-muted-foreground">
                    <div>{new Date(item.timestamp).toLocaleString(isHindi ? "hi-IN" : "en-US")}</div>
                    <div className="font-medium text-foreground">{item.geoTag?.ward ?? t("home.wardNotCaptured")}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-muted/45 p-8 text-center text-muted-foreground">
              No recent activity yet. Upload an image to start building activity cards.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
