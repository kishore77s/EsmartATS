"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Edit3,
  Plus,
  ArrowLeft,
  Lightbulb,
  Target,
  AlertCircle,
  Sparkles,
  Check,
} from "lucide-react";

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-slate-50 rounded-xl">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  ),
});

interface ResumeEditorProps {
  resumeText: string;
  missingKeywords: string[];
  suggestions: string[];
  missingSections: string[];
  missingSkills: string[];
  onBack: () => void;
  onReanalyze: (newText: string) => void;
}

export default function ResumeEditor({
  resumeText,
  missingKeywords,
  suggestions,
  missingSections,
  missingSkills,
  onBack,
  onReanalyze,
}: ResumeEditorProps) {
  const [editedText, setEditedText] = useState(resumeText);
  const [activeTab, setActiveTab] = useState<"keywords" | "suggestions" | "skills">("keywords");
  const [insertedKeywords, setInsertedKeywords] = useState<Set<string>>(new Set());

  // Check which keywords are now in the text
  useEffect(() => {
    const lowerText = editedText.toLowerCase();
    const nowPresent = new Set<string>();
    missingKeywords.forEach((kw) => {
      if (lowerText.includes(kw.toLowerCase())) {
        nowPresent.add(kw);
      }
    });
    setInsertedKeywords(nowPresent);
  }, [editedText, missingKeywords]);

  const keywordsRemaining = missingKeywords.filter(
    (kw) => !insertedKeywords.has(kw)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary-500" />
              Edit Your Resume
            </h3>
            <p className="text-slate-500 text-sm">
              Format your resume, add missing keywords, then download as PDF
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Keywords Added
          </span>
          <span className="text-sm font-semibold text-primary-600">
            {insertedKeywords.size} / {missingKeywords.length}
          </span>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                missingKeywords.length > 0
                  ? (insertedKeywords.size / missingKeywords.length) * 100
                  : 100
              }%`,
            }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
          />
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Rich Text Editor Panel */}
        <div className="lg:col-span-2">
          <RichTextEditor
            content={editedText}
            onChange={(html) => {
              // Extract plain text for keyword checking
              const div = document.createElement("div");
              div.innerHTML = html;
              setEditedText(div.textContent || "");
            }}
          />
        </div>

        {/* Suggestions Panel */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            {[
              { id: "keywords" as const, label: "Keywords", icon: Target },
              { id: "suggestions" as const, label: "Tips", icon: Lightbulb },
              { id: "skills" as const, label: "Skills", icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "keywords" && (
              <motion.div
                key="keywords"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" />
                  Missing Keywords
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Copy keywords and paste them into your resume
                </p>

                {keywordsRemaining.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {keywordsRemaining.map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => navigator.clipboard.writeText(keyword)}
                        className="group flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-full text-sm transition-colors"
                        title="Click to copy"
                      >
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {keyword}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Check className="w-4 h-4" />
                    All keywords added!
                  </div>
                )}

                {insertedKeywords.size > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h5 className="text-xs font-medium text-slate-500 mb-2">
                      Added Keywords
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(insertedKeywords).map((keyword) => (
                        <span
                          key={keyword}
                          className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                        >
                          <Check className="w-3 h-3" />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "suggestions" && (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-xl border border-slate-200 p-4 max-h-[400px] overflow-y-auto"
              >
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Improvement Suggestions
                </h4>

                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 bg-amber-50 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700">{suggestion}</p>
                    </div>
                  ))}

                  {missingSections.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <h5 className="text-xs font-medium text-slate-500 mb-2">
                        Add These Sections
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {missingSections.map((section) => (
                          <span
                            key={section}
                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-xl border border-slate-200 p-4"
              >
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Missing Skills
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Click to copy skill to clipboard
                </p>

                {missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.slice(0, 15).map((skill) => (
                      <button
                        key={skill}
                        onClick={() => navigator.clipboard.writeText(skill)}
                        className="group flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-full text-sm transition-colors"
                        title="Click to copy"
                      >
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {skill}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <Check className="w-4 h-4" />
                    All required skills covered!
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Re-analyze Button */}
          <button
            onClick={() => onReanalyze(editedText)}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl font-medium hover:from-primary-700 hover:to-accent-600 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Re-analyze Resume
          </button>
        </div>
      </div>
    </div>
  );
}
