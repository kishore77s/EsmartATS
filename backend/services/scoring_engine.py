"""
Scoring Engine Service
Calculates ATS compatibility scores based on multiple factors
"""

from typing import List, Dict


class ScoringEngine:
    """
    Professional scoring engine for ATS compatibility analysis
    
    Scoring Weights:
    - 40% → Keyword Match
    - 30% → TF-IDF Cosine Similarity  
    - 20% → Required Skills Match
    - 10% → Resume Structure Score
    """
    
    def __init__(self):
        # Scoring weights (sum = 100%)
        self.weights = {
            'keyword': 0.40,
            'similarity': 0.30,
            'skills': 0.20,
            'structure': 0.10
        }
        
        # Score thresholds for feedback
        self.thresholds = {
            'excellent': 85,
            'good': 70,
            'fair': 55,
            'poor': 40
        }
    
    def calculate_scores(
        self,
        keyword_match_ratio: float,
        similarity_score: float,
        skills_match_ratio: float,
        sections_found: List[str]
    ) -> Dict:
        """
        Calculate comprehensive ATS compatibility scores
        
        Args:
            keyword_match_ratio: Ratio of matched keywords (0-1)
            similarity_score: TF-IDF cosine similarity (0-100)
            skills_match_ratio: Ratio of matched skills (0-1)
            sections_found: List of detected resume sections
            
        Returns:
            Dictionary containing all scores
        """
        # Calculate individual scores (all on 0-100 scale)
        keyword_score = min(keyword_match_ratio * 100, 100)
        similarity_score = min(similarity_score, 100)
        skills_score = min(skills_match_ratio * 100, 100)
        structure_score = self._calculate_structure_score(sections_found)
        
        # Calculate weighted overall score
        overall_score = (
            keyword_score * self.weights['keyword'] +
            similarity_score * self.weights['similarity'] +
            skills_score * self.weights['skills'] +
            structure_score * self.weights['structure']
        )
        
        return {
            'overall_score': overall_score,
            'keyword_score': keyword_score,
            'similarity_score': similarity_score,
            'skills_score': skills_score,
            'structure_score': structure_score,
            'grade': self._get_grade(overall_score)
        }
    
    def _calculate_structure_score(self, sections_found: List[str]) -> float:
        """
        Calculate score based on resume structure completeness
        """
        required_sections = ['Skills', 'Experience', 'Education']
        bonus_sections = ['Projects', 'Summary', 'Certifications', 'Achievements']
        
        # Base score for required sections (max 70 points)
        required_found = sum(1 for s in required_sections if s in sections_found)
        base_score = (required_found / len(required_sections)) * 70
        
        # Bonus for additional sections (max 30 points)
        bonus_found = sum(1 for s in bonus_sections if s in sections_found)
        bonus_score = min((bonus_found / len(bonus_sections)) * 30, 30)
        
        return base_score + bonus_score
    
    def _get_grade(self, score: float) -> str:
        """
        Convert score to letter grade
        """
        if score >= self.thresholds['excellent']:
            return 'A'
        elif score >= self.thresholds['good']:
            return 'B'
        elif score >= self.thresholds['fair']:
            return 'C'
        elif score >= self.thresholds['poor']:
            return 'D'
        else:
            return 'F'
    
    def generate_suggestions(
        self,
        keyword_analysis: Dict,
        sections_analysis: Dict,
        skill_gap: Dict,
        overall_score: float
    ) -> List[str]:
        """
        Generate actionable improvement suggestions based on analysis
        """
        suggestions = []
        
        # Keyword-based suggestions
        missing_keywords = keyword_analysis.get('missing', [])
        if len(missing_keywords) > 5:
            suggestions.append(
                f"Add these important keywords from the job description: {', '.join(missing_keywords[:5])}"
            )
        elif len(missing_keywords) > 0:
            suggestions.append(
                f"Consider adding these keywords: {', '.join(missing_keywords)}"
            )
        
        # Skills gap suggestions  
        missing_skills = skill_gap.get('missing_skills', [])
        if missing_skills:
            if len(missing_skills) > 3:
                suggestions.append(
                    f"Critical: Add these required skills to your resume: {', '.join(missing_skills[:5])}"
                )
            else:
                suggestions.append(
                    f"Add missing skills: {', '.join(missing_skills)}"
                )
        
        # Section-based suggestions
        missing_sections = sections_analysis.get('missing', [])
        for section in missing_sections:
            if section == 'Skills':
                suggestions.append(
                    "Add a dedicated 'Skills' section with relevant technical and soft skills"
                )
            elif section == 'Experience':
                suggestions.append(
                    "Include a 'Work Experience' section with quantified achievements"
                )
            elif section == 'Education':
                suggestions.append(
                    "Add an 'Education' section with your degrees and certifications"
                )
        
        # Score-based suggestions
        if overall_score < 40:
            suggestions.insert(0, 
                "Your resume needs significant improvements to pass ATS screening"
            )
        elif overall_score < 55:
            suggestions.insert(0,
                "Consider tailoring your resume more closely to this job description"
            )
        elif overall_score < 70:
            suggestions.insert(0,
                "Good foundation! A few optimizations could improve your chances"
            )
        
        # Structure suggestions
        if 'Projects' not in sections_analysis.get('found', []):
            suggestions.append(
                "Consider adding a 'Projects' section to showcase relevant work"
            )
        
        if 'Summary' not in sections_analysis.get('found', []):
            suggestions.append(
                "Add a professional summary at the top highlighting key qualifications"
            )
        
        # General best practices
        if overall_score >= 70:
            suggestions.append(
                "Tip: Use specific metrics and numbers to quantify your achievements"
            )
        
        # Limit suggestions
        return suggestions[:8]
    
    def get_score_breakdown(self, scores: Dict) -> str:
        """
        Generate a human-readable score breakdown
        """
        breakdown = f"""
ATS Compatibility Analysis:
═══════════════════════════════════════
Overall Score: {scores['overall_score']:.1f}% (Grade: {scores['grade']})
═══════════════════════════════════════

Score Breakdown:
├─ Keyword Match (40%):    {scores['keyword_score']:.1f}%
├─ Content Similarity (30%): {scores['similarity_score']:.1f}%
├─ Skills Coverage (20%):   {scores['skills_score']:.1f}%
└─ Structure (10%):         {scores['structure_score']:.1f}%
        """
        return breakdown.strip()
