"""
Vercel Serverless Function: Analyze Resume
"""

from http.server import BaseHTTPRequestHandler
import json
import re
from collections import Counter

# Tech skills for detection
TECH_SKILLS = {
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust',
    'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'sql', 'bash', 'shell',
    'html', 'css', 'react', 'angular', 'vue', 'nodejs', 'node.js', 'express',
    'django', 'flask', 'fastapi', 'spring', 'nextjs', 'next.js', 'nuxt',
    'tailwind', 'bootstrap', 'sass', 'less', 'webpack', 'vite',
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
    'oracle', 'sqlite', 'dynamodb', 'firebase', 'supabase',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform',
    'ansible', 'ci/cd', 'github actions', 'gitlab', 'circleci', 'linux',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
    'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'nlp', 'computer vision',
    'data analysis', 'data science', 'statistics', 'ai', 'neural networks',
    'git', 'jira', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
    'api', 'testing', 'unit testing', 'selenium', 'cypress', 'figma',
}

RESUME_SECTIONS = {
    'skills': ['skills', 'technical skills', 'core competencies', 'technologies'],
    'experience': ['experience', 'work experience', 'professional experience', 'employment'],
    'education': ['education', 'academic', 'qualification', 'degree'],
    'projects': ['projects', 'personal projects', 'academic projects'],
    'certifications': ['certifications', 'certificates', 'credentials'],
    'summary': ['summary', 'objective', 'profile', 'about me', 'professional summary'],
    'achievements': ['achievements', 'accomplishments', 'awards', 'honors']
}


def extract_keywords(text: str) -> set:
    """Extract keywords from text"""
    text_lower = text.lower()
    words = set(re.findall(r'\b[a-z][a-z\+\#\.]+\b', text_lower))
    
    # Filter meaningful words (length > 2, not common words)
    stopwords = {'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'will', 'more', 'when', 'who', 'oil', 'its', 'how', 'way', 'may', 'use', 'she', 'each', 'which', 'their', 'time', 'very', 'than', 'would', 'with', 'this', 'that', 'from', 'they', 'about'}
    keywords = {w for w in words if len(w) > 2 and w not in stopwords}
    
    # Add detected tech skills
    for skill in TECH_SKILLS:
        if skill in text_lower:
            keywords.add(skill)
    
    return keywords


def calculate_similarity(resume: str, jd: str) -> float:
    """Calculate simple word overlap similarity"""
    resume_words = set(resume.lower().split())
    jd_words = set(jd.lower().split())
    
    if not jd_words:
        return 0.0
    
    intersection = resume_words.intersection(jd_words)
    union = resume_words.union(jd_words)
    
    # Jaccard similarity scaled to percentage
    return (len(intersection) / len(union)) * 100 if union else 0.0


def detect_sections(text: str) -> dict:
    """Detect resume sections"""
    text_lower = text.lower()
    found = []
    missing = []
    required = ['skills', 'experience', 'education']
    
    for section, patterns in RESUME_SECTIONS.items():
        if any(p in text_lower for p in patterns):
            found.append(section.title())
        elif section in required:
            missing.append(section.title())
    
    return {'found': found, 'missing': missing}


def analyze_skills(resume: str, jd: str) -> dict:
    """Analyze skill gap"""
    resume_lower = resume.lower()
    jd_lower = jd.lower()
    
    jd_skills = {s for s in TECH_SKILLS if s in jd_lower}
    resume_skills = {s for s in TECH_SKILLS if s in resume_lower}
    
    matched = jd_skills.intersection(resume_skills)
    missing = jd_skills - resume_skills
    additional = resume_skills - jd_skills
    
    ratio = len(matched) / len(jd_skills) if jd_skills else 1.0
    
    return {
        'required_skills': sorted(list(jd_skills)),
        'matched_skills': sorted(list(matched)),
        'missing_skills': sorted(list(missing)),
        'additional_skills': sorted(list(additional)),
        'match_ratio': ratio,
        'coverage_percentage': round(ratio * 100, 1)
    }


def generate_suggestions(keyword_analysis, sections, skill_gap, score) -> list:
    """Generate improvement suggestions"""
    suggestions = []
    
    missing_kw = keyword_analysis.get('missing', [])[:5]
    if missing_kw:
        suggestions.append(f"Add these important keywords: {', '.join(missing_kw)}")
    
    missing_skills = skill_gap.get('missing_skills', [])[:5]
    if missing_skills:
        suggestions.append(f"Add required skills: {', '.join(missing_skills)}")
    
    for section in sections.get('missing', []):
        suggestions.append(f"Add a '{section}' section to your resume")
    
    if score < 40:
        suggestions.insert(0, "Your resume needs significant improvements for this role")
    elif score < 55:
        suggestions.insert(0, "Consider tailoring your resume more closely to the job")
    elif score < 70:
        suggestions.insert(0, "Good foundation! A few optimizations could help")
    
    if 'Projects' not in sections.get('found', []):
        suggestions.append("Consider adding a 'Projects' section")
    
    if 'Summary' not in sections.get('found', []):
        suggestions.append("Add a professional summary at the top")
    
    return suggestions[:8]


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            resume_text = data.get('resume_text', '').strip()
            job_description = data.get('job_description', '').strip()
            
            if len(resume_text) < 50:
                self.send_error_response(400, "Resume text is too short")
                return
            
            if len(job_description) < 20:
                self.send_error_response(400, "Job description is too short")
                return
            
            # Extract keywords
            resume_keywords = extract_keywords(resume_text)
            jd_keywords = extract_keywords(job_description)
            
            matched = resume_keywords.intersection(jd_keywords)
            missing = jd_keywords - resume_keywords
            
            keyword_ratio = len(matched) / len(jd_keywords) if jd_keywords else 0
            
            keyword_analysis = {
                'matched': sorted(list(matched))[:30],
                'missing': sorted(list(missing))[:20],
                'match_ratio': keyword_ratio
            }
            
            # Calculate similarity
            similarity = calculate_similarity(resume_text, job_description)
            
            # Detect sections
            sections = detect_sections(resume_text)
            
            # Skill gap analysis
            skill_gap = analyze_skills(resume_text, job_description)
            
            # Calculate scores
            keyword_score = min(keyword_ratio * 100, 100)
            similarity_score = min(similarity, 100)
            skills_score = min(skill_gap['match_ratio'] * 100, 100)
            
            required_sections = ['Skills', 'Experience', 'Education']
            found_required = sum(1 for s in required_sections if s in sections['found'])
            structure_score = (found_required / len(required_sections)) * 70 + 30
            
            # Weighted overall score
            overall_score = (
                keyword_score * 0.40 +
                similarity_score * 0.30 +
                skills_score * 0.20 +
                structure_score * 0.10
            )
            
            # Generate suggestions
            suggestions = generate_suggestions(keyword_analysis, sections, skill_gap, overall_score)
            
            self.send_json_response({
                'overall_score': round(overall_score, 1),
                'keyword_score': round(keyword_score, 1),
                'similarity_score': round(similarity_score, 1),
                'skills_score': round(skills_score, 1),
                'structure_score': round(structure_score, 1),
                'matched_keywords': keyword_analysis['matched'],
                'missing_keywords': keyword_analysis['missing'],
                'sections_found': sections['found'],
                'sections_missing': sections['missing'],
                'suggestions': suggestions,
                'skill_gap_analysis': skill_gap
            })
            
        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON")
        except Exception as e:
            self.send_error_response(500, str(e))
    
    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, status, message):
        self.send_json_response({"detail": message}, status)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
