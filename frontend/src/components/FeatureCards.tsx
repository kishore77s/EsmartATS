"use client";

import { motion } from "framer-motion";
import {
  Target,
  BarChart3,
  Lightbulb,
  Shield,
  Zap,
  Layers,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Keyword Matching",
    description:
      "Identifies important keywords from job descriptions and checks if they appear in your resume.",
    color: "bg-blue-500",
  },
  {
    icon: BarChart3,
    title: "TF-IDF Scoring",
    description:
      "Uses advanced text analysis to measure how well your resume content aligns with job requirements.",
    color: "bg-purple-500",
  },
  {
    icon: Layers,
    title: "Section Detection",
    description:
      "Analyzes your resume structure to ensure all important sections are present and well-organized.",
    color: "bg-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Skills Gap Analysis",
    description:
      "Identifies technical skills mentioned in the job that are missing from your resume.",
    color: "bg-amber-500",
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description:
      "Provides actionable recommendations to improve your resume's ATS compatibility.",
    color: "bg-green-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your resume is processed securely and deleted immediately after analysis. No data stored.",
    color: "bg-slate-500",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get detailed analysis results in seconds with our optimized NLP processing pipeline.",
    color: "bg-orange-500",
  },
  {
    icon: CheckCircle,
    title: "Professional Scoring",
    description:
      "Multi-factor scoring system that mirrors how real ATS systems evaluate resumes.",
    color: "bg-cyan-500",
  },
];

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;

        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 card-hover"
          >
            <div
              className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>

            <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
              {feature.title}
            </h3>

            <p className="text-sm text-slate-500">{feature.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
