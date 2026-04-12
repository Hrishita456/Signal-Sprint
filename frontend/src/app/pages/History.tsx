import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Calendar, MapPin, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { readHistory, type StoredHistoryItem } from "../lib/history";

export function History() {
  const [filter, setFilter] = useState<"all" | "required" | "no-action">("all");
  const [historyData, setHistoryData] = useState<StoredHistoryItem[]>([]);

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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-muted/30 to-white px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="mb-2 text-4xl font-bold text-foreground">Analysis History</h1>
          <p className="text-lg text-muted-foreground">
            Review previous dustbin monitoring results
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 grid gap-6 md:grid-cols-4"
        >
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="text-sm text-muted-foreground">Total Analyses</div>
            <div className="mt-2 text-4xl font-bold text-foreground">{analytics.total}</div>
          </div>
          <div className="rounded-2xl bg-destructive/10 p-6 shadow-lg">
            <div className="text-sm text-destructive">Action Required</div>
            <div className="mt-2 text-4xl font-bold text-destructive">{analytics.required}</div>
          </div>
          <div className="rounded-2xl bg-primary/10 p-6 shadow-lg">
            <div className="text-sm text-primary">No Action Needed</div>
            <div className="mt-2 text-4xl font-bold text-primary">{analytics.noAction}</div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="text-sm text-muted-foreground">Action Rate</div>
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
            <h2 className="mb-4 text-xl font-semibold text-foreground">History Analytics</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">Today</div>
                <div className="text-3xl font-bold text-foreground">{analytics.todayCount}</div>
              </div>
              <div className="rounded-xl bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">Last 7 Days</div>
                <div className="text-3xl font-bold text-foreground">{analytics.weeklyCount}</div>
              </div>
              <div className="rounded-xl bg-muted/40 p-4 sm:col-span-2">
                <div className="text-sm text-muted-foreground">Avg Cleanup Turnaround</div>
                <div className="text-3xl font-bold text-foreground">
                  {analytics.avgTurnaroundHours === "N/A"
                    ? "N/A"
                    : `${analytics.avgTurnaroundHours}h`}
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
              Ward counts are shown in the table for action-required, no-action, and total reports.
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Ward Summary Table</h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="grid grid-cols-4 bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground">
                <div>Ward</div>
                <div className="text-center">Action Required</div>
                <div className="text-center">No Action</div>
                <div className="text-center">Total Reports</div>
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
                <div className="px-4 py-6 text-sm text-muted-foreground">No ward data yet.</div>
              )}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Paste coordinates in maps to get to the location.
            </p>
          </div>
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
            All
          </button>
          <button
            onClick={() => setFilter("required")}
            className={`rounded-xl px-6 py-3 transition-all ${
              filter === "required"
                ? "bg-destructive text-white shadow-lg"
                : "bg-white text-foreground shadow-md hover:shadow-lg"
            }`}
          >
            Action Required
          </button>
          <button
            onClick={() => setFilter("no-action")}
            className={`rounded-xl px-6 py-3 transition-all ${
              filter === "no-action"
                ? "bg-primary text-white shadow-lg"
                : "bg-white text-foreground shadow-md hover:shadow-lg"
            }`}
          >
            No Action
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
                <div className="flex flex-1 items-center justify-between">
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
                      {item.label || (item.result === 1 ? "DMC Action Required" : "No Action Needed")}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4" />
                      {new Date(item.timestamp).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ward: {item.geoTag?.ward ?? "Not captured"}
                    </div>
                    {item.geoTag ? (
                      <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                        <div className="font-medium text-foreground">
                          Coordinates: {item.geoTag.latitude.toFixed(6)},{" "}
                          {item.geoTag.longitude.toFixed(6)}
                        </div>
                        <a
                          href={`https://maps.google.com/?q=${item.geoTag.latitude},${item.geoTag.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <MapPin className="size-3.5" />
                          Open in Maps
                        </a>
                      </div>
                    ) : null}
                    {item.ticket ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                        <Ticket className="size-3.5" />
                        {item.ticket.caseId} · {item.ticket.status}
                      </div>
                    ) : null}
                  </div>

                  {/* Confidence */}
                  <div className="text-right">
                    <div className="mb-2 text-2xl font-bold text-foreground">0 / 1</div>
                    <div className="text-sm text-muted-foreground">Binary Output</div>
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
            <p className="text-xl text-muted-foreground">No results found for this filter</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
