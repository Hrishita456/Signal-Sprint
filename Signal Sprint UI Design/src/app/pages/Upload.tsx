import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Upload as UploadIcon, Camera, FolderOpen } from "lucide-react";
import { motion } from "motion/react";

export function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      navigate("/result", { state: { image: preview } });
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-muted/30 to-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`overflow-hidden rounded-3xl border-2 border-dashed bg-white shadow-xl transition-all ${
              isDragging
                ? "border-primary bg-primary/5 shadow-2xl shadow-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center px-8 py-20">
              <div className="mb-8 flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30">
                <UploadIcon className="size-14 text-white" />
              </div>

              <h1 className="mb-3 text-3xl font-bold text-foreground">Upload Dustbin Image</h1>
              <p className="mb-10 text-lg text-muted-foreground">
                Drag and drop your image here, or use one of the options below
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-xl"
                >
                  <FolderOpen className="size-5" />
                  Browse Files
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-white px-8 py-4 text-primary transition-all hover:bg-primary/5"
                >
                  <Camera className="size-5" />
                  Use Camera
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Image Preview</h2>
              <div className="mb-6 overflow-hidden rounded-xl bg-muted">
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-[500px] w-full object-contain"
                />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="rounded-xl border-2 border-border px-8 py-3 text-foreground transition-colors hover:bg-muted"
                >
                  Remove Image
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-3 text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="size-5 rounded-full border-2 border-white border-t-transparent"
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="size-5" />
                      Analyze Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

