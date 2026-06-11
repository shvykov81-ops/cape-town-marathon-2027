"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, AlertCircle, ExternalLink, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentUploadProps {
  onUpload: (doc: any) => void;
}

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      return;
    }

    setUploading(true);
    setError("");
    setProgress(0);

    try {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            data: base64,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const doc = await res.json();
        onUpload(doc);
        setUploading(false);
        setProgress(0);
      };

      reader.readAsDataURL(file);
    } catch (e: any) {
      setError(e.message || "Upload failed");
      setUploading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError("")} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-teal-500 bg-teal-500/10"
            : "border-white/20 hover:border-white/40 hover:bg-white/5"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={onFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="w-10 h-10 mx-auto border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-neutral-400">Uploading... {progress}%</p>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
              <motion.div
                className="h-full bg-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto mb-3 text-neutral-500" />
            <p className="text-sm font-medium text-neutral-300">
              Drop file here or click to browse
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              PDF, JPG, PNG, DOC up to 10MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}

interface DocumentListProps {
  documents: any[];
}

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="text-sm">No documents uploaded yet</p>
        <p className="text-xs text-neutral-600 mt-1">
          Upload passport, medical certificate, and insurance
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc: any) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-neutral-400" />
            <div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm hover:text-teal-400 transition-colors inline-flex items-center gap-1.5"
              >
                {doc.name}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <div className="text-xs text-neutral-500">
                {doc.uploadedAt
                  ? new Date(doc.uploadedAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-neutral-500 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all"
              title="View document"
            >
              <Eye className="w-4 h-4" />
            </a>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                doc.status === "verified"
                  ? "bg-green-500/20 text-green-400"
                  : doc.status === "pending"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {doc.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
