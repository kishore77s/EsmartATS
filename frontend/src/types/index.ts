// API Response Types

export interface UploadResponse {
  success: boolean;
  filename: string;
  extracted_text: string;
  character_count: number;
  word_count: number;
}

export interface SkillGapAnalysis {
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  additional_skills: string[];
  match_ratio: number;
  coverage_percentage: number;
}

export interface AnalysisResult {
  overall_score: number;
  keyword_score: number;
  similarity_score: number;
  skills_score: number;
  structure_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  sections_found: string[];
  sections_missing: string[];
  suggestions: string[];
  skill_gap_analysis: SkillGapAnalysis;
}

export interface AnalyzeRequest {
  resume_text: string;
  job_description: string;
}

// Component Props Types

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  selectedFile: File | null;
}

export interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
  isLoading: boolean;
  fileName?: string;
}

export interface ResultsPanelProps {
  results: AnalysisResult;
  onReset: () => void;
  onEdit?: () => void;
}

export interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export interface KeywordListProps {
  keywords: string[];
  type: "matched" | "missing";
  title: string;
}

export interface SuggestionAccordionProps {
  suggestions: string[];
}

export interface SectionAnalysisProps {
  found: string[];
  missing: string[];
}
