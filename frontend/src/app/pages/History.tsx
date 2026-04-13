import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Calendar, MapPin, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { clearHistory, readHistory, type StoredHistoryItem } from "../lib/history";
import { useI18n } from "../lib/i18n";

export function History() {
  const [filter, setFilter] = useState<"all" | "required" | "no-action">("all");
  const [historyData, setHistoryData] = useState<StoredHistoryItem[]>([]);
  const { t, isHindi } = useI18n();

  useEffect(() => {
    setHistoryData(readHistory());
  }, []);

  const filteredHistory = useMemo(() => {
    return historyData.filter((item) => {
      if (filter === "required") return item.result === 1;
      if (filter === "no-action") return item.result === 0;
      return true;
    });
  }, [filter, historyData]);

  const analytics = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

    const total = historyData.length;
    const required = historyData.filter((item) => item.result === 1).length;
    const noAction = total - required;
    const todayCount = historyData.filter(
      (item) => new Date(item.timestamp).getTime() >= startOfToday,
    ).length;
    const weeklyCount = historyData.filter(
      (item) => new Date(item.timestamp).getTime() >= weekAgo,
    ).length;
    const actionRate = total > 0 ? Math.round((required / total) * 100) : 0;

    const resolvedTickets = historyData.filter((item) => item.ticket?.resolvedAt);
    const avgTurnaroundHours =
      resolvedTickets.length > 0
        ? (
            resolvedTickets.reduce((sum, item) => {
              const createdAt = item.ticket?.createdAt ? new Date(item.ticket.createdAt).getTime() : 0;
              const resolvedAt = item.ticket?.resolvedAt ? new Date(item.ticket.resolvedAt).getTime() : 0;
              return sum + Math.max(0, resolvedAt - createdAt);
            }, 0) /
            resolvedTickets.length /
            (1000 * 60 * 60)
          ).toFixed(1)
        : "N/A";

    return {
      total,
      required,
      noAction,
      todayCount,
      weeklyCount,
      actionRate,
      avgTurnaroundHours,
    };
  }, [historyData]);

  const handleClearHistory = () => {
    if (!window.confirm(t("history.clearConfirm"))) {
      return;
    }
    clearHistory();
    setHistoryData([]);
  };

  const wardSummary = useMemo(() => {
    const wardMap = new Map<string, { required: number; noAction: number; total: number }>();

    historyData.forEach((item) => {
      const ward = item.geoTag?.ward ?? "Ward not captured";
      const current = wardMap.get(ward) ?? { required: 0, noAction: 0, total: 0 };
      current.total += 1;
      if (item.result === 1) {
        current.required += 1;
      } else {
        current.noAction += 1;
      }
      wardMap.set(ward, current);
    });

    return [...wardMap.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [historyData]);

  const topHotspots = useMemo(() => {
    const now = Date.now();
    const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const hotspotMap = new Map<string, { score: number; recentRequired: number; totalRequired: number }>();

    historyData.forEach((item) => {
      const ward = item.geoTag?.ward ?? "Ward not captured";
      const timestamp = new Date(item.timestamp).getTime();
      const current = hotspotMap.get(ward) ?? { score: 0, recentRequired: 0, totalRequired: 0 };

      if (item.result === 1) {
        current.totalRequired += 1;
        current.score += 1;
        if (timestamp >= sevenDaysAgo) {
          current.score += 1;
        }
        if (timestamp >= threeDaysAgo) {
          current.recentRequired += 1;
          current.score += 2;
        }
      }

      hotspotMap.set(ward, current);
    });

    return [...hotspotMap.entries()]
      .filter(([, value]) => value.totalRequired > 0)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 3);
  }, [historyData]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#e8f7f3] via-[#eef7ff] to-[#f6fbff] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="mb-2 text-4xl font-bold text-foreground">{t("history.title")}</h1>
          <p className="text-lg text-muted-foreground">
            {t("history.subtitle")}
          </p>
          <div className="mt-4">
            <button
              onClick={handleClearHistory}
              className="rounded-xl border border-destructive bg-white px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
            >
              {t("history.clearHistory")}
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 grid gap-6 md:grid-cols-4"
        >
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="text-sm text-muted-foreground">{t("history.totalAnalyses")}</div>
            <div className="mt-2 text-4xl font-bold text-foreground">{analytics.total}</div>
          </div>
          <div className="rounded-2xl bg-destructive/10 p-6 shadow-lg">
            <div className="text-sm text-destructive">{t("history.actionRequired")}</div>
            <div className="mt-2 text-4xl font-bold text-destructive">{analytics.required}</div>
          </div>
          <div className="rounded-2xl bg-primary/10 p-6 shadow-lg">
            <div className="text-sm text-primary">{t("history.noActionNeeded")}</div>
            <div className="mt-2 text-4xl font-bold text-primary">{analytics.noAction}</div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="text-sm text-muted-foreground">{t("history.actionRate")}</div>
            <div className="mt-2 text-4xl font-bold text-foreground">{analytics.actionRate}%</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10 grid gap-6 lg:grid-cols-2"
        >
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-foreground">{t("history.analytics")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">{t("history.today")}</div>
                <div className="text-3xl font-bold text-foreground">{analytics.todayCount}</div>
              </div>
              <div className="rounded-xl bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">{t("history.last7Days")}</div>
                <div className="text-3xl font-bold text-foreground">{analytics.weeklyCount}</div>
              </div>
              <div className="rounded-xl bg-muted/40 p-4 sm:col-span-2">
                <div className="text-sm text-muted-foreground">{t("history.turnaround")}</div>
                <div className="text-3xl font-bold text-foreground">
                  {analytics.avgTurnaroundHours === "N/A"
                    ? "N/A"
                    : `${analytics.avgTurnaroundHours}h`}
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
              {t("history.wardCountsHint")}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-foreground">{t("history.wardTable")}</h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="grid grid-cols-4 bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground">
                <div>{t("history.table.ward")}</div>
                <div className="text-center">{t("history.table.action")}</div>
                <div className="text-center">{t("history.table.noAction")}</div>
                <div className="text-center">{t("history.table.total")}</div>
              </div>
              {wardSummary.length > 0 ? (
                wardSummary.map(([ward, value]) => (
                  <div
                    key={ward}
                    className="grid grid-cols-4 border-t border-border px-4 py-3 text-sm"
                  >
                    <div className="font-medium text-foreground">{ward}</div>
                    <div className="text-center font-semibold text-destructive">{value.required}</div>
                    <div className="text-center font-semibold text-primary">{value.noAction}</div>
                    <div className="text-center font-semibold text-foreground">{value.total}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-sm text-muted-foreground">{t("history.noWardData")}</div>
              )}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("history.mapsHint")}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mb-10 rounded-2xl bg-white p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-foreground">{t("history.hotspots")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("history.hotspotsSub")}</p>
          {topHotspots.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {topHotspots.map(([ward, value], index) => (
                <div key={ward} className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="text-sm font-semibold text-muted-foreground">#{index + 1}</div>
                  <div className="mt-1 text-lg font-bold text-foreground">{ward}</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {t("history.predictedRisk")}:{" "}
                    <span className="font-semibold text-destructive">{value.score}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {t("history.recentActionRequired")}:{" "}
                    <span className="font-semibold text-foreground">{value.recentRequired}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("history.totalActionRequired")}:{" "}
                    <span className="font-semibold text-foreground">{value.totalRequired}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
              {t("history.noHotspots")}
            </div>
          )}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex gap-3"
        >
          <button
            onClick={() => setFilter("all")}
            className={`rounded-xl px-6 py-3 transition-all ${
              filter === "all"
                ? "bg-foreground text-white shadow-lg"
                : "bg-white text-foreground shadow-md hover:shadow-lg"
            }`}
          >
            {t("history.filter.all")}
          </button>
          <button
            onClick={() => setFilter("required")}
            className={`rounded-xl px-6 py-3 transition-all ${
              filter === "required"
                ? "bg-destructive text-white shadow-lg"
                : "bg-white text-foreground shadow-md hover:shadow-lg"
            }`}
          >
            {t("history.filter.required")}
          </button>
          <button
            onClick={() => setFilter("no-action")}
            className={`rounded-xl px-6 py-3 transition-all ${
              filter === "no-action"
                ? "bg-primary text-white shadow-lg"
                : "bg-white text-foreground shadow-md hover:shadow-lg"
            }`}
          >
            {t("history.filter.noAction")}
          </button>
        </motion.div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="flex gap-6 p-6">
                {/* Thumbnail */}
                <div className="relative h-32 w-48 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={item.thumbnail}
                    alt={`Analysis ${item.id}`}
                    className="size-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="grid flex-1 items-center gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
                  <div className="space-y-2">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                        item.result === 1
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {item.result === 1 ? (
                        <AlertCircle className="size-4" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                      {item.result === 1 ? t("history.badge.actionRequired") : t("history.badge.noAction")}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4" />
                      {new Date(item.timestamp).toLocaleString(isHindi ? "hi-IN" : "en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("history.table.ward")}: {item.geoTag?.ward ?? t("history.notCaptured")}
                    </div>
                    {item.ticket ? (
                      <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-800">
                        <Ticket className="size-3.5" />
                        {item.ticket.caseId} {t("history.ticketStatusSeparator")} {item.ticket.status}
                      </div>
                    ) : null}
                  </div>

                  <div className="min-h-28 rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("history.coordinates")}
                    </div>
                    {item.geoTag ? (
                      <>
                        <div className="text-sm font-semibold text-foreground">
                          {item.geoTag.latitude.toFixed(6)}, {item.geoTag.longitude.toFixed(6)}
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${item.geoTag.latitude},${item.geoTag.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary/90"
                        >
                          <MapPin className="size-4" />
                          {t("history.openInMaps")}
                        </a>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">{t("history.locationNotCaptured")}</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-white py-20 text-center shadow-lg"
          >
            <p className="text-xl text-muted-foreground">{t("history.noResults")}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
