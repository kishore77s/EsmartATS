"""
Text Cleaner Utility
Handles text preprocessing and cleaning for NLP analysis
"""

import re
import string
from typing import List


class TextCleaner:
    """
    Utility class for cleaning and preprocessing resume and job description text
    """
    
    def __init__(self):
        # Common patterns to clean
        self.url_pattern = re.compile(
            r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        )
        self.email_pattern = re.compile(r'[\w\.-]+@[\w\.-]+\.\w+')
        self.phone_pattern = re.compile(
            r'[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}'
        )
        self.special_chars_pattern = re.compile(r'[^\w\s\-\.\,\;\:\!\?\(\)\[\]\{\}\/\&\+\#\@]')
        self.multiple_spaces_pattern = re.compile(r'\s+')
        self.multiple_newlines_pattern = re.compile(r'\n{3,}')
    
    def clean_text(self, text: str, preserve_structure: bool = True) -> str:
        """
        Clean text while preserving important content
        
        Args:
            text: Raw text to clean
            preserve_structure: Whether to preserve paragraph structure
            
        Returns:
            Cleaned text
        """
        if not text:
            return ""
        
        # Normalize unicode characters
        text = self._normalize_unicode(text)
        
        # Remove or replace special characters but preserve some structure
        text = self._clean_special_chars(text)
        
        # Normalize whitespace
        text = self._normalize_whitespace(text, preserve_structure)
        
        # Remove extra newlines but preserve paragraph breaks
        if preserve_structure:
            text = self.multiple_newlines_pattern.sub('\n\n', text)
        else:
            text = text.replace('\n', ' ')
            text = self.multiple_spaces_pattern.sub(' ', text)
        
        return text.strip()
    
    def _normalize_unicode(self, text: str) -> str:
        """
        Normalize unicode characters to ASCII equivalents where possible
        """
        replacements = {
            '\u2019': "'",   # Right single quote
            '\u2018': "'",   # Left single quote
            '\u201c': '"',   # Left double quote
            '\u201d': '"',   # Right double quote
            '\u2013': '-',   # En dash
            '\u2014': '-',   # Em dash
            '\u2022': '*',   # Bullet point
            '\u2026': '...', # Ellipsis
            '\xa0': ' ',     # Non-breaking space
            '\t': ' ',       # Tab
        }
        
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        return text
    
    def _clean_special_chars(self, text: str) -> str:
        """
        Remove problematic special characters while preserving important ones
        """
        # Keep alphanumeric, spaces, and common punctuation
        cleaned = re.sub(r'[^\w\s\-\.\,\;\:\!\?\(\)\[\]\{\}\/\&\+\#\@\'\"\|]', ' ', text)
        return cleaned
    
    def _normalize_whitespace(self, text: str, preserve_structure: bool = True) -> str:
        """
        Normalize whitespace in text
        """
        if preserve_structure:
            # Replace multiple spaces with single space, preserve newlines
            lines = text.split('\n')
            normalized_lines = [self.multiple_spaces_pattern.sub(' ', line).strip() for line in lines]
            return '\n'.join(normalized_lines)
        else:
            return self.multiple_spaces_pattern.sub(' ', text)
    
    def extract_sections(self, text: str) -> dict:
        """
        Attempt to extract sections from resume text
        """
        sections = {}
        section_headers = [
            'summary', 'objective', 'profile',
            'experience', 'work experience', 'professional experience',
            'education', 'academic background',
            'skills', 'technical skills', 'core competencies',
            'projects', 'personal projects',
            'certifications', 'certificates',
            'achievements', 'awards'
        ]
        
        lines = text.split('\n')
        current_section = 'header'
        current_content = []
        
        for line in lines:
            line_lower = line.lower().strip()
            
            # Check if this line is a section header
            is_header = False
            for header in section_headers:
                if line_lower.startswith(header) or line_lower == header:
                    # Save previous section
                    if current_content:
                        sections[current_section] = '\n'.join(current_content)
                    
                    current_section = header.replace(' ', '_')
                    current_content = []
                    is_header = True
                    break
            
            if not is_header:
                current_content.append(line)
        
        # Save last section
        if current_content:
            sections[current_section] = '\n'.join(current_content)
        
        return sections
    
    def remove_pii(self, text: str) -> str:
        """
        Remove personally identifiable information for privacy
        """
        # Remove emails
        text = self.email_pattern.sub('[EMAIL]', text)
        
        # Remove phone numbers
        text = self.phone_pattern.sub('[PHONE]', text)
        
        # Remove URLs
        text = self.url_pattern.sub('[URL]', text)
        
        return text
    
    def tokenize(self, text: str, lowercase: bool = True) -> List[str]:
        """
        Simple tokenization for text
        """
        if lowercase:
            text = text.lower()
        
        # Split on whitespace and punctuation
        tokens = re.findall(r'\b\w+\b', text)
        
        return tokens
    
    def remove_stopwords(self, tokens: List[str], additional_stopwords: List[str] = None) -> List[str]:
        """
        Remove common English stopwords from token list
        """
        stopwords = {
            'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
            'not', 'no', 'nor', 'so', 'up', 'out', 'if', 'about', 'into', 'through',
            'during', 'before', 'after', 'above', 'below', 'between', 'under',
            'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
            'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some',
            'such', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also',
            'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
            'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself',
            'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them',
            'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this',
            'that', 'these', 'those', 'am', 'being', 'because', 'until', 'while'
        }
        
        if additional_stopwords:
            stopwords.update(set(additional_stopwords))
        
        return [token for token in tokens if token.lower() not in stopwords]
