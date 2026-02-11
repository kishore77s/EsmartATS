"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import type { SuggestionAccordionProps } from "@/types";

export default function SuggestionAccordion({
  suggestions,
}: SuggestionAccordionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleChecked = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="bg-amber-50 rounded-xl border border-amber-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-amber-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-800">
              Improvement Suggestions
            </h4>
            <p className="text-sm text-amber-600">
              {checkedItems.size} of {suggestions.length} completed
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Progress indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(checkedItems.size / suggestions.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs text-amber-600 font-medium">
              {Math.round((checkedItems.size / suggestions.length) * 100)}%
            </span>
          </div>

          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-amber-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-amber-600" />
          )}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 space-y-3">
              {suggestions.map((suggestion, index) => {
                const isChecked = checkedItems.has(index);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleChecked(index)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      isChecked
                        ? "bg-green-100 border border-green-300"
                        : "bg-white border border-amber-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked
                            ? "bg-green-500 border-green-500"
                            : "border-amber-300"
                        }`}
                      >
                        {isChecked && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          isChecked
                            ? "text-green-700 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {suggestion}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
