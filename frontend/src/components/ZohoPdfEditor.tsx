"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileEdit,
  Upload,
  ExternalLink,
  AlertCircle,
  Loader2,
  X,
  Download,
  CheckCircle,
  Info,
} from "lucide-react";

interface ZohoPdfEditorProps {
  resumeText?: string;
  onClose?: () => void;
  onSave?: (pdfBlob: Blob) => void;
}

export default function ZohoPdfEditor({
  resumeText,
  onClose,
  onSave,
}: ZohoPdfEditorProps) {
  const [editorUrl, setEditorUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  // Check if Zoho API is configured
  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const response = await fetch("/api/zoho-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_session", document_name: "test" }),
      });
      const data = await response.json();
      
      if (data.error && data.error.includes("not configured")) {
        setIsConfigured(false);
      } else {
        setIsConfigured(true);
      }
    } catch {
      setIsConfigured(false);
    }
  };

  const createEditSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/zoho-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_session",
          document_name: "My Resume",
          save_url: `${window.location.origin}/api/zoho-save`,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.editor_url) {
        setEditorUrl(data.editor_url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create editing session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, create a new session and user can upload in Zoho editor
      // Full implementation would upload to cloud storage first
      await createEditSession();
    } catch (err: any) {
      setError(err.message || "Failed to upload PDF");
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfigured === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Zoho PDF Editor Setup Required
            </h3>
            <p className="text-slate-600 mb-4">
              To enable PDF editing, you need to configure the Zoho Office Integrator API.
            </p>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-slate-700 mb-2">Setup Steps:</h4>
              <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                <li>
                  Go to{" "}
                  <a
                    href="https://www.zoho.com/officeintegrator/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Zoho Office Integrator
                  </a>{" "}
                  and create an account
                </li>
                <li>Get your API key from the developer console</li>
                <li>
                  Add <code className="bg-slate-200 px-1 rounded">ZOHO_API_KEY</code> to your
                  Vercel environment variables
                </li>
                <li>Redeploy your application</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <a
                href="https://www.zoho.com/officeintegrator/api/v1/getting-started.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View API Docs
              </a>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (editorUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <FileEdit className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-slate-800">Zoho PDF Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              Use the editor toolbar to save or download
            </span>
            <button
              onClick={() => setEditorUrl(null)}
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Zoho Editor iframe */}
        <iframe
          src={editorUrl}
          className="w-full h-[calc(100vh-60px)] border-0"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <FileEdit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            Zoho PDF Editor
          </h3>
          <p className="text-slate-500 text-sm">
            Create or edit professional PDF resumes
          </p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Create New */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={createEditSession}
          disabled={isLoading}
          className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border-2 border-dashed border-primary-200 hover:border-primary-400 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
              <FileEdit className="w-8 h-8 text-primary-500" />
            </div>
          )}
          <div className="text-center">
            <h4 className="font-semibold text-slate-800 mb-1">
              Create New Resume
            </h4>
            <p className="text-sm text-slate-500">
              Start with a blank document
            </p>
          </div>
        </motion.button>

        {/* Upload Existing */}
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center gap-4 p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-400 transition-colors cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
            <Upload className="w-8 h-8 text-slate-500" />
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-slate-800 mb-1">
              Edit Existing PDF
            </h4>
            <p className="text-sm text-slate-500">
              Upload a PDF to edit
            </p>
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
        </motion.label>
      </div>

      {/* Features */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h4 className="font-medium text-slate-700 mb-4">Editor Features</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileEdit, label: "Edit Text" },
            { icon: Upload, label: "Add Images" },
            { icon: CheckCircle, label: "Add Signatures" },
            { icon: Download, label: "Download PDF" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <feature.icon className="w-4 h-4 text-primary-500" />
              {feature.label}
            </div>
          ))}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
