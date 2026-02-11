"use client";

import { motion } from "framer-motion";
import { RefreshCw, Download, CheckCircle, XCircle, Lightbulb, BarChart3, Target, Layers, Edit3 } from "lucide-react";
import ScoreCircle from "./ScoreCircle";
import KeywordList from "./KeywordList";
import SuggestionAccordion from "./SuggestionAccordion";
import type { ResultsPanelProps } from "@/types";

export default function ResultsPanel({ results, onReset, onEdit }: ResultsPanelProps) {
  const {
    overall_score,
    keyword_score,
    similarity_score,
    skills_score,
    structure_score,
    matched_keywords,
    missing_keywords,
    sections_found,
    sections_missing,
    suggestions,
    skill_gap_analysis,
  } = results;

  // Determine score color and label
  const getScoreInfo = (score: number) => {
    if (score >= 85) return { color: "text-green-600", bg: "bg-green-100", label: "Excellent", emoji: "🎉" };
    if (score >= 70) return { color: "text-blue-600", bg: "bg-blue-100", label: "Good", emoji: "👍" };
    if (score >= 55) return { color: "text-amber-600", bg: "bg-amber-100", label: "Fair", emoji: "📝" };
    if (score >= 40) return { color: "text-orange-600", bg: "bg-orange-100", label: "Needs Work", emoji: "⚠️" };
    return { color: "text-red-600", bg: "bg-red-100", label: "Poor", emoji: "❌" };
  };

  const scoreInfo = getScoreInfo(overall_score);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">Analysis Results</h3>
          <p className="text-slate-500">Your ATS compatibility report</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          New Scan
        </button>
      </div>

      {/* Main Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`p-8 rounded-2xl ${scoreInfo.bg} border border-opacity-50`}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreCircle score={overall_score} size={180} />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-3xl">{scoreInfo.emoji}</span>
              <span className={`text-2xl font-bold ${scoreInfo.color}`}>
                {scoreInfo.label}
              </span>
            </div>
            <p className="text-slate-600 mb-4">
              {overall_score >= 70
                ? "Your resume is well-optimized for this job description!"
                : overall_score >= 55
                ? "Your resume has a good foundation but could use improvements."
                : "Your resume needs significant optimization to pass ATS screening."}
            </p>
            
            {/* Score breakdown mini */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Keywords", score: keyword_score, icon: Target },
                { label: "Similarity", score: similarity_score, icon: BarChart3 },
                { label: "Skills", score: skills_score, icon: CheckCircle },
                { label: "Structure", score: structure_score, icon: Layers },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/60 rounded-lg p-3 text-center"
                >
                  <item.icon className="w-5 h-5 mx-auto mb-1 text-slate-500" />
                  <div className="text-lg font-semibold text-slate-800">
                    {item.score.toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Keywords Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <KeywordList
            keywords={matched_keywords}
            type="matched"
            title="Matched Keywords"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <KeywordList
            keywords={missing_keywords}
            type="missing"
            title="Missing Keywords"
          />
        </motion.div>
      </div>

      {/* Section Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-50 rounded-xl p-6"
      >
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary-500" />
          Resume Sections
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium text-slate-500 mb-3">
              Detected Sections
            </h5>
            <div className="flex flex-wrap gap-2">
              {sections_found.map((section) => (
                <span
                  key={section}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  {section}
                </span>
              ))}
              {sections_found.length === 0 && (
                <span className="text-slate-400 text-sm">No sections detected</span>
              )}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-slate-500 mb-3">
              Missing Sections
            </h5>
            <div className="flex flex-wrap gap-2">
              {sections_missing.map((section) => (
                <span
                  key={section}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  {section}
                </span>
              ))}
              {sections_missing.length === 0 && (
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  All required sections present!
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills Gap Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6"
      >
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-500" />
          Skills Coverage: {skill_gap_analysis.coverage_percentage}%
        </h4>

        <div className="mb-4">
          <div className="h-3 bg-white rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill_gap_analysis.coverage_percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-green-700 mb-2">
              Matched Skills ({skill_gap_analysis.matched_skills.length})
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {skill_gap_analysis.matched_skills.slice(0, 10).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-red-700 mb-2">
              Missing Skills ({skill_gap_analysis.missing_skills.length})
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {skill_gap_analysis.missing_skills.slice(0, 10).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SuggestionAccordion suggestions={suggestions} />
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-500 text-white rounded-xl font-medium hover:from-accent-700 hover:to-accent-600 transition-all shadow-lg shadow-accent-500/25 flex items-center justify-center gap-2"
          >
            <Edit3 className="w-5 h-5" />
            Edit Resume with Suggestions
          </button>
        )}
        <button
          onClick={onReset}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-medium hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}
