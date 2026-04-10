import { useState } from "react";
import { Link } from "react-router";
import { AlertCircle, CheckCircle2, Calendar } from "lucide-react";
import { motion } from "motion/react";

type HistoryItem = {
  id: string;
  thumbnail: string;
  result: 0 | 1;
  confidence: number;
  timestamp: Date;
};

export function History() {
  const [filter, setFilter] = useState<"all" | "required" | "no-action">("all");

  const historyData: HistoryItem[] = [
    {
      id: "1",
      thumbnail:
        "https://images.unsplash.com/photo-1749586147694-0adb542a13f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      result: 1,
      confidence: 94,
      timestamp: new Date(2026, 3, 10, 14, 30),
    },
    {
      id: "2",
      thumbnail:
        "https://images.unsplash.com/photo-1769328599122-e4147e037321?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      result: 0,
      confidence: 87,
      timestamp: new Date(2026, 3, 10, 12, 15),
    },
    {
      id: "3",
      thumbnail:
        "https://images.unsplash.com/photo-1769164746692-40223237b2fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      result: 1,
      confidence: 91,
      timestamp: new Date(2026, 3, 9, 16, 45),
    },
    {
      id: "4",
      thumbnail:
        "https://images.unsplash.com/photo-1691151118213-0d702b668f80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      result: 0,
      confidence: 88,
      timestamp: new Date(2026, 3, 9, 10, 20),
    },
    {
      id: "5",
      thumbnail:
        "https://images.unsplash.com/photo-1738856289730-e26e968af0ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      result: 1,
      confidence: 96,
      timestamp: new Date(2026, 3, 8, 15, 10),
    },
    {
      id: "6",
      thumbnail:
        "https://images.unsplash.com/photo-1769328599122-e4147e037321?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      result: 0,
      confidence: 82,
      timestamp: new Date(2026, 3, 8, 9, 5),
    },
  ];

  const filteredHistory = historyData.filter((item) => {
    if (filter === "required") return item.result === 1;
    if (filter === "no-action") return item.result === 0;
    return true;
  });

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
                      {item.result === 1 ? "DMC Action Required" : "No Action Needed"}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4" />
                      {item.timestamp.toLocaleString("en-US", {
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
                    <div className="mb-2 text-3xl font-bold text-foreground">
                      {item.confidence}%
                    </div>
                    <div className="text-sm text-muted-foreground">Confidence</div>
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
            <div className="mb-4 text-6xl">📭</div>
            <p className="text-xl text-muted-foreground">No results found for this filter</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

