"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FileUpload from "@/components/FileUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import ResultsPanel from "@/components/ResultsPanel";
import LoadingSpinner from "@/components/LoadingSpinner";
import FeatureCards from "@/components/FeatureCards";
import HowItWorks from "@/components/HowItWorks";
import { analyzeResume, uploadResume } from "@/lib/api";
import type { AnalysisResult } from "@/types";

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<"upload" | "job" | "results">("upload");

  const handleFileSelect = async (file: File) => {
    setResumeFile(file);
    setError("");
    setIsUploading(true);

    try {
      const response = await uploadResume(file);
      setResumeText(response.extracted_text);
      setStep("job");
    } catch (err: any) {
      setError(err.message || "Failed to process resume. Please try again.");
      setResumeFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription.trim()) {
      setError("Please provide both resume and job description");
      return;
    }

    setError("");
    setIsAnalyzing(true);

    try {
      const analysisResults = await analyzeResume(resumeText, jobDescription);
      setResults(analysisResults);
      setStep("results");
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setResumeText("");
    setJobDescription("");
    setResults(null);
    setError("");
    setStep("upload");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full filter blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-slate-900 mb-6"
            >
              AI-Powered{" "}
              <span className="gradient-text">Resume Scanner</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-slate-600 max-w-3xl mx-auto"
            >
              Optimize your resume for ATS systems with intelligent analysis.
              Get instant compatibility scores, keyword insights, and
              improvement suggestions.
            </motion.p>
          </div>

          {/* Main Scanner Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Progress Steps */}
              <div className="flex border-b border-slate-200">
                {["Upload Resume", "Job Description", "Results"].map(
                  (label, index) => {
                    const stepKey = ["upload", "job", "results"][index];
                    const isActive = step === stepKey;
                    const isCompleted =
                      (step === "job" && index === 0) ||
                      (step === "results" && index <= 1);

                    return (
                      <div
                        key={label}
                        className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                          isActive
                            ? "bg-primary-50 text-primary-700 border-b-2 border-primary-500"
                            : isCompleted
                            ? "bg-accent-50 text-accent-700"
                            : "text-slate-400"
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {isCompleted && !isActive ? (
                            <svg
                              className="w-5 h-5 text-accent-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                                isActive
                                  ? "bg-primary-500 text-white"
                                  : "bg-slate-200 text-slate-500"
                              }`}
                            >
                              {index + 1}
                            </span>
                          )}
                          {label}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Content Area */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {error}
                      </div>
                    </motion.div>
                  )}

                  {step === "upload" && (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <FileUpload
                        onFileSelect={handleFileSelect}
                        isLoading={isUploading}
                        selectedFile={resumeFile}
                      />
                    </motion.div>
                  )}

                  {step === "job" && (
                    <motion.div
                      key="job"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <JobDescriptionInput
                        value={jobDescription}
                        onChange={setJobDescription}
                        onAnalyze={handleAnalyze}
                        onBack={() => setStep("upload")}
                        isLoading={isAnalyzing}
                        fileName={resumeFile?.name}
                      />
                    </motion.div>
                  )}

                  {step === "results" && results && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <ResultsPanel results={results} onReset={handleReset} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {(isUploading || isAnalyzing) && (
                  <div className="mt-8">
                    <LoadingSpinner
                      message={
                        isUploading
                          ? "Extracting text from your resume..."
                          : "Analyzing your resume with AI..."
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to optimize your resume for ATS systems
            </p>
          </div>
          <FeatureCards />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to optimize your resume
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>
    </div>
  );
}
