"use client";

import { motion } from "framer-motion";
import type { ScoreCircleProps } from "@/types";

export default function ScoreCircle({
  score,
  size = 160,
  strokeWidth = 12,
  label = "ATS Score",
}: ScoreCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const getColor = (score: number) => {
    if (score >= 85) return { stroke: "#22c55e", bg: "#dcfce7" }; // Green
    if (score >= 70) return { stroke: "#3b82f6", bg: "#dbeafe" }; // Blue
    if (score >= 55) return { stroke: "#f59e0b", bg: "#fef3c7" }; // Amber
    if (score >= 40) return { stroke: "#f97316", bg: "#fed7aa" }; // Orange
    return { stroke: "#ef4444", bg: "#fee2e2" }; // Red
  };

  const colorScheme = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorScheme.bg}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorScheme.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>

      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-bold"
          style={{ color: colorScheme.stroke }}
        >
          {score.toFixed(0)}%
        </motion.span>
        <span className="text-sm text-slate-500 font-medium">{label}</span>
      </div>
    </div>
  );
}
