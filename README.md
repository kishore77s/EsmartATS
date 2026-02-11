# 🚀 SmartATS - AI-Powered Resume Screening & Job Match Analyzer

![SmartATS Banner](https://via.placeholder.com/1200x400?text=SmartATS+-+AI+Resume+Scanner)

SmartATS is a full-stack web application that analyzes resumes against job descriptions and generates an ATS compatibility score using NLP and machine learning techniques.

## ✨ Features

- **📄 Resume Upload** - Support for PDF and DOCX formats with drag-and-drop
- **🎯 Keyword Matching** - Identifies important keywords and checks alignment
- **📊 TF-IDF Scoring** - Advanced text similarity analysis using cosine similarity
- **🔍 Section Detection** - Analyzes resume structure (Skills, Experience, Education, Projects)
- **📈 Skills Gap Analysis** - Identifies missing technical skills
- **💡 Smart Suggestions** - Actionable recommendations for improvement
- **🔐 Privacy First** - Resume deleted immediately after analysis

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (Animations)
- **React Dropzone** (File upload)
- **Axios** (API calls)

### Backend
- **FastAPI** (Python)
- **spaCy** (NLP processing)
- **Scikit-learn** (TF-IDF & Cosine Similarity)
- **pdfplumber** (PDF extraction)
- **python-docx** (DOCX extraction)

## 📊 Scoring System

The ATS compatibility score is calculated using a weighted multi-factor approach:

| Factor | Weight | Description |
|--------|--------|-------------|
| Keyword Match | 40% | Overlap between resume and job description keywords |
| TF-IDF Similarity | 30% | Cosine similarity using TF-IDF vectorization |
| Skills Coverage | 20% | Technical skills mentioned in both documents |
| Structure Score | 10% | Presence of required resume sections |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- pip

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 📁 Project Structure

```
smartats/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── services/
│   │   ├── resume_parser.py # PDF/DOCX text extraction
│   │   ├── nlp_processor.py # NLP analysis (spaCy, TF-IDF)
│   │   └── scoring_engine.py# Score calculation
│   ├── utils/
│   │   └── text_cleaner.py  # Text preprocessing
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   ├── lib/             # API functions
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### POST `/upload-resume`
Upload and extract text from resume file.

**Request:** `multipart/form-data` with `file` field

**Response:**
```json
{
  "success": true,
  "filename": "resume.pdf",
  "extracted_text": "...",
  "character_count": 2500,
  "word_count": 400
}
```

### POST `/analyze`
Analyze resume against job description.

**Request:**
```json
{
  "resume_text": "Your resume content...",
  "job_description": "Job posting content..."
}
```

**Response:**
```json
{
  "overall_score": 75.5,
  "keyword_score": 80.0,
  "similarity_score": 65.0,
  "skills_score": 85.0,
  "structure_score": 70.0,
  "matched_keywords": ["python", "javascript", "react"],
  "missing_keywords": ["kubernetes", "terraform"],
  "sections_found": ["Skills", "Experience", "Education"],
  "sections_missing": ["Projects"],
  "suggestions": ["Add missing skills...", "Include a projects section..."],
  "skill_gap_analysis": {
    "matched_skills": ["python", "react"],
    "missing_skills": ["kubernetes"],
    "coverage_percentage": 80.0
  }
}
```

### POST `/quick-scan`
Combined upload and analyze in one request.

## 🔐 Security Features

- ✅ File type validation (PDF/DOCX only)
- ✅ File size limit (5MB max)
- ✅ Immediate file deletion after processing
- ✅ CORS configuration
- ✅ Rate limiting ready

## 🚀 Deployment

### Vercel (Frontend)
1. Push your code to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Render (Backend)
1. Create new Web Service
2. Connect your repository
3. Set build command: `pip install -r requirements.txt && python -m spacy download en_core_web_sm`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy

## 📈 Future Enhancements

- [ ] Resume Builder integration
- [ ] Industry-specific scoring models
- [ ] ML model trained on real hiring data
- [ ] Recruiter dashboard
- [ ] Bulk resume analysis
- [ ] OpenAI integration for AI suggestions
- [ ] User authentication & history
- [ ] Resume comparison tools

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by SmartATS Team
