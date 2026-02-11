"""
SmartATS - AI-Powered Resume Screening & Job Match Analyzer
Main FastAPI Application
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import tempfile
import uuid

from services.resume_parser import ResumeParser
from services.nlp_processor import NLPProcessor
from services.scoring_engine import ScoringEngine
from utils.text_cleaner import TextCleaner

app = FastAPI(
    title="SmartATS API",
    description="AI-Powered Resume Screening & Job Match Analyzer",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
resume_parser = ResumeParser()
nlp_processor = NLPProcessor()
scoring_engine = ScoringEngine()
text_cleaner = TextCleaner()

# Constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {'.pdf', '.docx'}


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str


class AnalyzeResponse(BaseModel):
    overall_score: float
    keyword_score: float
    similarity_score: float
    skills_score: float
    structure_score: float
    matched_keywords: List[str]
    missing_keywords: List[str]
    sections_found: List[str]
    sections_missing: List[str]
    suggestions: List[str]
    skill_gap_analysis: dict


@app.get("/")
async def root():
    return {"message": "SmartATS API is running", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Upload and extract text from resume (PDF/DOCX)
    """
    # Validate file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content
    content = await file.read()
    
    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Create temporary file for processing
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Extract text from resume
        extracted_text = resume_parser.extract_text(temp_path, file_ext)
        
        if not extracted_text or len(extracted_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract sufficient text from the resume. Please ensure the file is not empty or corrupted."
            )
        
        # Clean the extracted text
        cleaned_text = text_cleaner.clean_text(extracted_text)
        
        return {
            "success": True,
            "filename": file.filename,
            "extracted_text": cleaned_text,
            "character_count": len(cleaned_text),
            "word_count": len(cleaned_text.split())
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Security: Delete file after processing
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_resume(request: AnalyzeRequest):
    """
    Analyze resume against job description and return ATS compatibility score
    """
    try:
        resume_text = request.resume_text.strip()
        job_description = request.job_description.strip()
        
        if len(resume_text) < 50:
            raise HTTPException(
                status_code=400,
                detail="Resume text is too short for analysis"
            )
        
        if len(job_description) < 20:
            raise HTTPException(
                status_code=400,
                detail="Job description is too short for analysis"
            )
        
        # Clean texts
        cleaned_resume = text_cleaner.clean_text(resume_text)
        cleaned_jd = text_cleaner.clean_text(job_description)
        
        # NLP Processing
        resume_keywords = nlp_processor.extract_keywords(cleaned_resume)
        jd_keywords = nlp_processor.extract_keywords(cleaned_jd)
        
        # Calculate similarity score using TF-IDF and cosine similarity
        similarity_score = nlp_processor.calculate_similarity(cleaned_resume, cleaned_jd)
        
        # Keyword matching analysis
        keyword_analysis = nlp_processor.analyze_keywords(resume_keywords, jd_keywords)
        
        # Section detection
        sections_analysis = nlp_processor.detect_sections(cleaned_resume)
        
        # Skills gap analysis
        skill_gap = nlp_processor.analyze_skill_gap(cleaned_resume, cleaned_jd)
        
        # Calculate final scores
        scores = scoring_engine.calculate_scores(
            keyword_match_ratio=keyword_analysis['match_ratio'],
            similarity_score=similarity_score,
            skills_match_ratio=skill_gap['match_ratio'],
            sections_found=sections_analysis['found']
        )
        
        # Generate improvement suggestions
        suggestions = scoring_engine.generate_suggestions(
            keyword_analysis=keyword_analysis,
            sections_analysis=sections_analysis,
            skill_gap=skill_gap,
            overall_score=scores['overall_score']
        )
        
        return AnalyzeResponse(
            overall_score=round(scores['overall_score'], 1),
            keyword_score=round(scores['keyword_score'], 1),
            similarity_score=round(scores['similarity_score'], 1),
            skills_score=round(scores['skills_score'], 1),
            structure_score=round(scores['structure_score'], 1),
            matched_keywords=keyword_analysis['matched'],
            missing_keywords=keyword_analysis['missing'],
            sections_found=sections_analysis['found'],
            sections_missing=sections_analysis['missing'],
            suggestions=suggestions,
            skill_gap_analysis=skill_gap
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/quick-scan")
async def quick_scan(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Combined endpoint: Upload resume and analyze in one request
    """
    # First, upload and extract text
    upload_result = await upload_resume(file)
    
    if not upload_result['success']:
        raise HTTPException(status_code=400, detail="Failed to process resume")
    
    # Then analyze
    analyze_request = AnalyzeRequest(
        resume_text=upload_result['extracted_text'],
        job_description=job_description
    )
    
    return await analyze_resume(analyze_request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
