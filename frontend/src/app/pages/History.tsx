import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Calendar } from "lucide-react";
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

  const stats = {
    total: historyData.length,
    required: historyData.filter((item) => item.result === 1).length,
    noAction: historyData.filter((item) => item.result === 0).length,
  };

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
          className="mb-10 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="text-sm text-muted-foreground">Total Analyses</div>
            <div className="mt-2 text-4xl font-bold text-foreground">{stats.total}</div>
          </div>
          <div className="rounded-2xl bg-destructive/10 p-6 shadow-lg">
            <div className="text-sm text-destructive">Action Required</div>
            <div className="mt-2 text-4xl font-bold text-destructive">{stats.required}</div>
          </div>
          <div className="rounded-2xl bg-primary/10 p-6 shadow-lg">
            <div className="text-sm text-primary">No Action Needed</div>
            <div className="mt-2 text-4xl font-bold text-primary">{stats.noAction}</div>
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
