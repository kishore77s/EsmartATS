"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle } from "lucide-react";
import type { FileUploadProps } from "@/types";

export default function FileUpload({
  onFileSelect,
  isLoading,
  selectedFile,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
      multiple: false,
      disabled: isLoading,
    });

  const hasError = fileRejections.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          Upload Your Resume
        </h3>
        <p className="text-slate-500">
          Drag and drop your resume or click to browse
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`
          dropzone relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out transform hover:scale-[1.01] active:scale-[0.99]
          ${
            isDragActive
              ? "dropzone-active border-primary-500 bg-primary-50"
              : selectedFile
              ? "border-accent-500 bg-accent-50"
              : hasError
              ? "border-red-400 bg-red-50"
              : "border-slate-300 hover:border-primary-400 hover:bg-slate-50"
          }
          ${isLoading ? "opacity-50 cursor-wait pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">
          {selectedFile ? (
            <>
              <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-accent-600" />
              </div>
              <p className="text-lg font-medium text-accent-700 mb-1">
                {selectedFile.name}
              </p>
              <p className="text-sm text-accent-600">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </>
          ) : isDragActive ? (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4 animate-pulse">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-lg font-medium text-primary-700">
                Drop your resume here
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg font-medium text-slate-700 mb-1">
                Drop your resume here, or{" "}
                <span className="text-primary-600">browse</span>
              </p>
              <p className="text-sm text-slate-500">
                Supports PDF and DOCX (max 5MB)
              </p>
            </>
          )}
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="spinner mb-3"></div>
              <p className="text-sm text-slate-600">Processing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 animate-fadeIn">
          {fileRejections[0]?.errors[0]?.code === "file-too-large"
            ? "File is too large. Maximum size is 5MB."
            : fileRejections[0]?.errors[0]?.code === "file-invalid-type"
            ? "Invalid file type. Please upload a PDF or DOCX file."
            : "Error uploading file. Please try again."}
        </div>
      )}

      {/* File format hints */}
      <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13H11v-1H8.5v1zm0 3H11v-1H8.5v1zm6.5-3h-2.5v-1H15v1zm0 3h-2.5v-1H15v1z" />
          </svg>
          PDF
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 11h8v2H8v-2zm0 4h8v2H8v-2z" />
          </svg>
          DOCX
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Max 5MB
        </div>
      </div>
    </div>
  );
}
