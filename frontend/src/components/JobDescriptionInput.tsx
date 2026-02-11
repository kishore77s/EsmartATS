"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, FileText, Sparkles } from "lucide-react";
import type { JobDescriptionInputProps } from "@/types";

export default function JobDescriptionInput({
  value,
  onChange,
  onAnalyze,
  onBack,
  isLoading,
  fileName,
}: JobDescriptionInputProps) {
  const [charCount, setCharCount] = useState(value.length);

  const handleChange = (text: string) => {
    onChange(text);
    setCharCount(text.length);
  };

  const isValid = value.trim().length >= 50;

  return (
    <div className="space-y-6">
      {/* Header with file info */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {fileName && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-50 rounded-full text-sm text-accent-700">
            <FileText className="w-4 h-4" />
            {fileName}
          </div>
        )}
      </div>

      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Paste Job Description
        </h3>
        <p className="text-slate-500">
          Copy the job posting you're applying for
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Paste the complete job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in Python, JavaScript, and cloud technologies. The ideal candidate should have:

- Strong experience with React and Node.js
- Knowledge of AWS or GCP
- Experience with CI/CD pipelines
- Excellent problem-solving skills
..."
          rows={12}
          disabled={isLoading}
          className={`
            w-full px-4 py-4 rounded-xl border-2 resize-none text-black
            focus:outline-none focus:ring-2 focus:ring-primary-500/20
            transition-all duration-200 placeholder:text-slate-400
            ${
              isLoading
                ? "bg-slate-50 border-slate-200 cursor-not-allowed text-slate-600"
                : "border-slate-200 hover:border-slate-300 focus:border-primary-500"
            }
          `}
        />

        {/* Character count */}
        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
          {charCount} characters
          {charCount < 50 && charCount > 0 && (
            <span className="text-amber-500 ml-1">
              (min 50)
            </span>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Tips for best results</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Include the full job description with requirements</li>
              <li>• Keep the skills and qualifications section</li>
              <li>• Include any technologies or tools mentioned</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Change Resume
        </button>

        <motion.button
          onClick={onAnalyze}
          disabled={!isValid || isLoading}
          whileHover={{ scale: isValid && !isLoading ? 1.02 : 1 }}
          whileTap={{ scale: isValid && !isLoading ? 0.98 : 1 }}
          className={`
            flex-1 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2
            transition-all duration-200
            ${
              isValid && !isLoading
                ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-lg shadow-primary-500/25"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Analyze Resume
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
