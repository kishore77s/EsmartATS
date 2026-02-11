"use client";

import { CheckCircle, XCircle } from "lucide-react";
import type { KeywordListProps } from "@/types";

export default function KeywordList({
  keywords,
  type,
  title,
}: KeywordListProps) {
  const isMatched = type === "matched";

  return (
    <div
      className={`rounded-xl p-6 border ${
        isMatched
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        {isMatched ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
        <h4 className={`font-semibold ${isMatched ? "text-green-800" : "text-red-800"}`}>
          {title}
        </h4>
        <span
          className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
            isMatched ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {keywords.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
        {keywords.length > 0 ? (
          keywords.map((keyword, index) => (
            <span
              key={`${keyword}-${index}`}
              className={`keyword-chip ${
                isMatched ? "keyword-chip-matched" : "keyword-chip-missing"
              }`}
            >
              {keyword}
            </span>
          ))
        ) : (
          <p className={`text-sm ${isMatched ? "text-green-600" : "text-red-600"}`}>
            {isMatched
              ? "No matching keywords found"
              : "Great! No missing keywords"}
          </p>
        )}
      </div>
    </div>
  );
}
