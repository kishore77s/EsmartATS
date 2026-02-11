import axios from "axios";
import type { UploadResponse, AnalysisResult, AnalyzeRequest } from "@/types";

// API base URL - uses /api for Vercel serverless functions, fallback to localhost for dev
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 second timeout for file processing
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Upload a resume file and extract text
 */
export async function uploadResume(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post<UploadResponse>("/upload-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Failed to upload resume. Please try again.");
  }
}

/**
 * Analyze resume against job description
 */
export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  const request: AnalyzeRequest = {
    resume_text: resumeText,
    job_description: jobDescription,
  };

  try {
    const response = await api.post<AnalysisResult>("/analyze", request);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Analysis failed. Please try again.");
  }
}

/**
 * Quick scan - upload and analyze in one request
 */
export async function quickScan(
  file: File,
  jobDescription: string
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);

  try {
    const response = await api.post<AnalysisResult>("/quick-scan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Quick scan failed. Please try again.");
  }
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await api.get("/health");
    return response.data.status === "healthy";
  } catch {
    return false;
  }
}
