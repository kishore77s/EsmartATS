"""
NLP Processor Service
Handles keyword extraction, TF-IDF vectorization, and cosine similarity
"""

import re
import string
from typing import List, Dict, Set, Tuple
from collections import Counter

import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If model not found, download it
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")


class NLPProcessor:
    """
    NLP Processing service for resume analysis
    """
    
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000,
            lowercase=True
        )
        
        # Common technical skills for detection
        self.tech_skills = {
            # Programming Languages
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust',
            'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'sql', 'bash', 'shell',
            
            # Web Technologies
            'html', 'css', 'react', 'angular', 'vue', 'nodejs', 'node.js', 'express',
            'django', 'flask', 'fastapi', 'spring', 'nextjs', 'next.js', 'nuxt',
            'tailwind', 'bootstrap', 'sass', 'less', 'webpack', 'vite',
            
            # Databases
            'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
            'oracle', 'sqlite', 'dynamodb', 'firebase', 'supabase',
            
            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform',
            'ansible', 'ci/cd', 'github actions', 'gitlab', 'circleci', 'linux',
            
            # Data Science & ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
            'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'nlp', 'computer vision',
            'data analysis', 'data science', 'statistics', 'ai', 'neural networks',
            
            # Tools & Others
            'git', 'jira', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
            'api', 'testing', 'unit testing', 'selenium', 'cypress', 'figma',
        }
        
        # Important resume sections
        self.resume_sections = {
            'skills': ['skills', 'technical skills', 'core competencies', 'technologies'],
            'experience': ['experience', 'work experience', 'professional experience', 'employment'],
            'education': ['education', 'academic', 'qualification', 'degree'],
            'projects': ['projects', 'personal projects', 'academic projects'],
            'certifications': ['certifications', 'certificates', 'credentials'],
            'summary': ['summary', 'objective', 'profile', 'about me', 'professional summary'],
            'achievements': ['achievements', 'accomplishments', 'awards', 'honors']
        }
    
    def extract_keywords(self, text: str) -> List[str]:
        """
        Extract meaningful keywords from text using spaCy NER and POS tagging
        """
        doc = nlp(text.lower())
        keywords = set()
        
        # Extract named entities
        for ent in doc.ents:
            if ent.label_ in ['ORG', 'PRODUCT', 'WORK_OF_ART', 'LAW']:
                keywords.add(ent.text.lower())
        
        # Extract nouns and proper nouns
        for token in doc:
            if token.pos_ in ['NOUN', 'PROPN'] and len(token.text) > 2:
                if not token.is_stop and token.is_alpha:
                    keywords.add(token.lemma_.lower())
        
        # Extract noun phrases
        for chunk in doc.noun_chunks:
            phrase = chunk.text.lower().strip()
            if len(phrase) > 3 and len(phrase.split()) <= 3:
                keywords.add(phrase)
        
        # Add detected technical skills
        text_lower = text.lower()
        for skill in self.tech_skills:
            if skill in text_lower:
                keywords.add(skill)
        
        return list(keywords)
    
    def calculate_similarity(self, resume_text: str, job_description: str) -> float:
        """
        Calculate TF-IDF cosine similarity between resume and job description
        """
        try:
            # Fit and transform both texts
            tfidf_matrix = self.tfidf_vectorizer.fit_transform([resume_text, job_description])
            
            # Calculate cosine similarity
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            
            # Convert to percentage (0-100)
            return float(similarity * 100)
            
        except Exception as e:
            print(f"Similarity calculation error: {e}")
            return 0.0
    
    def analyze_keywords(self, resume_keywords: List[str], jd_keywords: List[str]) -> Dict:
        """
        Analyze keyword overlap between resume and job description
        """
        resume_set = set(kw.lower() for kw in resume_keywords)
        jd_set = set(kw.lower() for kw in jd_keywords)
        
        matched = resume_set.intersection(jd_set)
        missing = jd_set - resume_set
        extra = resume_set - jd_set
        
        # Calculate match ratio
        match_ratio = len(matched) / len(jd_set) if jd_set else 0
        
        return {
            'matched': sorted(list(matched)),
            'missing': sorted(list(missing))[:20],  # Limit to top 20
            'extra': sorted(list(extra)),
            'match_ratio': match_ratio,
            'total_jd_keywords': len(jd_set),
            'total_resume_keywords': len(resume_set)
        }
    
    def detect_sections(self, resume_text: str) -> Dict:
        """
        Detect which resume sections are present
        """
        text_lower = resume_text.lower()
        found_sections = []
        missing_sections = []
        
        required_sections = ['skills', 'experience', 'education']
        recommended_sections = ['projects', 'summary', 'certifications']
        
        for section_name, patterns in self.resume_sections.items():
            section_found = any(pattern in text_lower for pattern in patterns)
            
            if section_found:
                found_sections.append(section_name.title())
            elif section_name in required_sections:
                missing_sections.append(section_name.title())
        
        # Calculate structure score
        required_found = sum(1 for s in required_sections if s.title() in found_sections)
        structure_ratio = required_found / len(required_sections)
        
        return {
            'found': found_sections,
            'missing': missing_sections,
            'structure_ratio': structure_ratio,
            'has_all_required': len(missing_sections) == 0
        }
    
    def analyze_skill_gap(self, resume_text: str, job_description: str) -> Dict:
        """
        Analyze skill gap between resume and job requirements
        """
        resume_lower = resume_text.lower()
        jd_lower = job_description.lower()
        
        # Find skills mentioned in job description
        jd_skills = set()
        for skill in self.tech_skills:
            if skill in jd_lower:
                jd_skills.add(skill)
        
        # Find skills in resume
        resume_skills = set()
        for skill in self.tech_skills:
            if skill in resume_lower:
                resume_skills.add(skill)
        
        matched_skills = jd_skills.intersection(resume_skills)
        missing_skills = jd_skills - resume_skills
        extra_skills = resume_skills - jd_skills
        
        match_ratio = len(matched_skills) / len(jd_skills) if jd_skills else 1.0
        
        return {
            'required_skills': sorted(list(jd_skills)),
            'matched_skills': sorted(list(matched_skills)),
            'missing_skills': sorted(list(missing_skills)),
            'additional_skills': sorted(list(extra_skills)),
            'match_ratio': match_ratio,
            'coverage_percentage': round(match_ratio * 100, 1)
        }
    
    def get_keyword_frequency(self, text: str) -> Dict[str, int]:
        """
        Get frequency of important keywords in text
        """
        doc = nlp(text.lower())
        
        # Filter meaningful tokens
        meaningful_tokens = [
            token.lemma_ for token in doc
            if not token.is_stop 
            and not token.is_punct 
            and token.is_alpha 
            and len(token.text) > 2
        ]
        
        return dict(Counter(meaningful_tokens).most_common(50))
