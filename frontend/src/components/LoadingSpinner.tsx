"use client";

import { motion } from "framer-motion";
import { FileSearch, Sparkles, Brain } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = "Processing...",
}: LoadingSpinnerProps) {
  const steps = [
    { icon: FileSearch, label: "Extracting text" },
    { icon: Brain, label: "Analyzing content" },
    { icon: Sparkles, label: "Generating insights" },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Animated loader */}
      <div className="relative mb-6">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-primary-200"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-6 h-6 text-primary-500" />
        </div>
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg font-medium text-slate-700 mb-2"
      >
        {message}
      </motion.p>

      {/* Steps indicator */}
      <div className="flex items-center gap-4 mt-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5,
              }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-xs text-slate-500">{step.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Tip */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-sm text-slate-400 mt-6"
      >
        This usually takes a few seconds...
      </motion.p>
    </div>
  );
}
