import { motion } from "motion/react";
import { Trash2, AlertTriangle, Leaf, CheckCircle, XCircle } from "lucide-react";

export function Guidelines() {
  const rules = [
    {
      title: "Authorized Dustbins",
      color: "blue",
      bgClass: "bg-blue-500",
      lightBgClass: "bg-blue-50",
      textClass: "text-blue-700",
      icon: Trash2,
      description:
        "Only DMC-authorized dustbins are considered valid. Unauthorized containers or makeshift bins are not acceptable.",
    },
    {
      title: "Garbage Without Dustbin",
      color: "orange",
      bgClass: "bg-orange-500",
      lightBgClass: "bg-orange-50",
      textClass: "text-orange-700",
      icon: AlertTriangle,
      description:
        "Garbage found outside or near a dustbin without an authorized bin present requires DMC action. This includes dumping areas.",
    },
    {
      title: "Natural Leaves Excluded",
      color: "green",
      bgClass: "bg-primary",
      lightBgClass: "bg-primary/10",
      textClass: "text-primary",
      icon: Leaf,
      description:
        "Natural fallen leaves are excluded from detection. Only man-made waste and garbage trigger action requirements.",
    },
    {
      title: "Full Dustbin ≠ Action",
      color: "teal",
      bgClass: "bg-teal-500",
      lightBgClass: "bg-teal-50",
      textClass: "text-teal-700",
      icon: CheckCircle,
      description:
        "A full dustbin alone does not trigger DMC action. Action is only required when garbage spills outside the bin.",
    },
    {
      title: "Action Triggers",
      color: "red",
      bgClass: "bg-destructive",
      lightBgClass: "bg-destructive/10",
      textClass: "text-destructive",
      icon: XCircle,
      description:
        "DMC action is required when: (1) Garbage spills outside authorized dustbin, or (2) Garbage found without any authorized dustbin.",
    },
  ];

  const decisionMatrix = [
    {
      condition: "Authorized dustbin present + No spill",
      decision: 0,
      label: "No Action",
      color: "primary",
    },
    {
      condition: "Authorized dustbin present + Garbage overflow/spill",
      decision: 1,
      label: "Action Required",
      color: "destructive",
    },
    {
      condition: "No authorized dustbin + Garbage present",
      decision: 1,
      label: "Action Required",
      color: "destructive",
    },
    {
      condition: "Only natural leaves (no man-made waste)",
      decision: 0,
      label: "No Action",
      color: "primary",
    },
    {
      condition: "Full dustbin (waste contained inside)",
      decision: 0,
      label: "No Action",
      color: "primary",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#e8f7f3] via-[#eef7ff] to-[#f6fbff] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="mb-2 text-4xl font-bold text-foreground">Detection Guidelines</h1>
          <p className="text-lg text-muted-foreground">
            Understanding the AI detection criteria and decision-making process
          </p>
        </motion.div>

        {/* Rules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="mb-6 text-2xl font-semibold text-foreground">Key Rules</h2>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`overflow-hidden rounded-2xl ${rule.lightBgClass} shadow-lg`}
              >
                <div className="flex gap-6 p-6">
                  <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${rule.bgClass} shadow-md`}
                  >
                    <rule.icon className="size-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`mb-2 text-xl font-semibold ${rule.textClass}`}>
                      {rule.title}
                    </h3>
                    <p className="text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Decision Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="mb-6 text-2xl font-semibold text-foreground">Decision Matrix</h2>
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="grid gap-px bg-border">
              {/* Header */}
              <div className="grid grid-cols-3 gap-px bg-border">
                <div className="bg-muted p-4 font-semibold text-foreground">Condition</div>
                <div className="bg-muted p-4 text-center font-semibold text-foreground">
                  Decision
                </div>
                <div className="bg-muted p-4 text-center font-semibold text-foreground">
                  Status
                </div>
              </div>

              {/* Rows */}
              {decisionMatrix.map((row, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="grid grid-cols-3 gap-px bg-border"
                >
                  <div className="bg-white p-4 text-foreground">{row.condition}</div>
                  <div className="flex items-center justify-center bg-white p-4">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg font-bold text-white ${
                        row.decision === 1 ? "bg-destructive" : "bg-primary"
                      }`}
                    >
                      {row.decision}
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-white p-4">
                    <span
                      className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                        row.color === "destructive"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {row.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Summary Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-12 rounded-2xl bg-primary/5 p-8"
        >
          <h3 className="mb-3 text-xl font-semibold text-foreground">Summary</h3>
          <p className="text-muted-foreground">
            The DMC Smart Monitor uses binary classification (0 or 1) to determine if action is
            needed. Decision 0 means no DMC intervention required, while Decision 1 triggers cleanup
            operations. The system prioritizes detection of overflow and unauthorized dumping while
            excluding natural debris.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
