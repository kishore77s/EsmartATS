"use client";

import { motion } from "framer-motion";
import { Upload, FileSearch, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Upload Resume",
    description:
      "Drag and drop your PDF or DOCX resume. We'll extract the text automatically and securely.",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: 2,
    icon: FileSearch,
    title: "Add Job Description",
    description:
      "Paste the job posting you're targeting. The more detailed, the better the analysis.",
    color: "from-purple-500 to-purple-600",
  },
  {
    number: 3,
    icon: CheckCircle,
    title: "Get Results",
    description:
      "Receive instant ATS score, keyword analysis, section detection, and actionable improvements.",
    color: "from-green-500 to-green-600",
  },
];

export default function HowItWorks() {
  return (
    <div className="relative">
      {/* Connection line - desktop only */}
      <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-green-300" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Arrow connector - mobile only */}
              {index < steps.length - 1 && (
                <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2">
                  <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step number with icon */}
                <div className="relative mb-6">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-700">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {step.title}
                </h3>

                <p className="text-slate-500 max-w-xs">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl font-medium hover:from-primary-700 hover:to-accent-600 transition-all shadow-lg shadow-primary-500/25"
        >
          Start Analyzing Your Resume
          <ArrowRight className="w-5 h-5" />
        </a>
      </motion.div>
    </div>
  );
}
