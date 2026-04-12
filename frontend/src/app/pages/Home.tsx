import { Link } from "react-router";
import { Upload } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-muted/30 to-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 overflow-hidden rounded-3xl bg-white p-12 text-center shadow-xl"
        >
          <div className="mx-auto mb-8 flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/30">
            <Upload className="size-16 text-white" />
          </div>

          <h1 className="mb-4 text-5xl font-bold text-foreground">DMC Smart Monitor</h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            AI-powered system to detect overflow and spill conditions near authorized dustbins.
            Upload an image to instantly determine if DMC action is required.
          </p>

          <Link
            to="/upload"
            className="inline-flex items-center gap-3 rounded-xl bg-primary px-10 py-4 text-lg text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40"
          >
            <Upload className="size-6" />
            Upload Dustbin Image
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-6 text-center"
        >
          <p className="text-lg font-medium text-foreground">
            Sustainability Impact: Faster waste-response routing helps keep IIT Kanpur cleaner,
            reduce unmanaged spill zones, and support safer campus mobility.
          </p>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 rounded-2xl bg-primary/5 p-8 text-center"
        >
          <h3 className="mb-3 text-xl font-semibold text-foreground">How It Works</h3>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Our AI analyzes images to detect garbage overflow, spill conditions, and unauthorized
            waste dumping. Get instant binary decisions with confidence scoring to help DMC
            prioritize cleanup operations efficiently.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
