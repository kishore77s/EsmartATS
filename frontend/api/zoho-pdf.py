"""
Zoho PDF Editor API Integration
API: https://www.zohoapis.com/pdfeditor/api/v1
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.parse

# Zoho API Configuration
# Set these in Vercel environment variables
ZOHO_API_KEY = os.environ.get("ZOHO_API_KEY", "")
ZOHO_DC = os.environ.get("ZOHO_DC", "com")  # com, eu, in, com.cn, com.au, jp

ZOHO_BASE_URL = f"https://www.zohoapis.{ZOHO_DC}/pdfeditor/api/v1"


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}

            action = data.get("action", "create_session")

            if action == "create_session":
                result = self.create_edit_session(data)
            elif action == "create_from_url":
                result = self.create_from_url(data)
            else:
                result = {"error": "Unknown action"}

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def create_edit_session(self, data: dict) -> dict:
        """
        Create a new PDF editing session in Zoho
        This allows creating a blank PDF or from template
        """
        if not ZOHO_API_KEY:
            return {
                "error": "Zoho API key not configured",
                "message": "Please set ZOHO_API_KEY environment variable in Vercel"
            }

        try:
            url = f"{ZOHO_BASE_URL}/document"
            
            # Prepare the request
            document_config = {
                "document_info": {
                    "document_name": data.get("document_name", "Resume")
                },
                "editor_settings": {
                    "language": "en",
                    "country": "US"
                },
                "callback_settings": {
                    "save_format": "pdf",
                    "save_url": data.get("save_url", ""),
                    "save_url_params": data.get("save_params", {})
                },
                "permissions": {
                    "document.edit": True,
                    "document.print": True,
                    "document.download": True,
                    "review.comment": True,
                    "review.highlight": True
                },
                "document_defaults": {
                    "orientation": "portrait",
                    "paper_size": "Letter",
                    "margin": {
                        "top": "1in",
                        "right": "1in",
                        "bottom": "1in",
                        "left": "1in"
                    }
                }
            }

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Zoho-oauthtoken {ZOHO_API_KEY}"
            }

            req = urllib.request.Request(
                url,
                data=json.dumps(document_config).encode(),
                headers=headers,
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode())
                return {
                    "success": True,
                    "editor_url": result.get("document_url", ""),
                    "session_id": result.get("session_id", ""),
                    "document_id": result.get("document_id", "")
                }

        except urllib.error.HTTPError as e:
            error_body = e.read().decode() if e.fp else str(e)
            return {"error": f"Zoho API error: {error_body}"}
        except Exception as e:
            return {"error": str(e)}

    def create_from_url(self, data: dict) -> dict:
        """
        Create an editing session from an existing PDF URL
        """
        if not ZOHO_API_KEY:
            return {
                "error": "Zoho API key not configured",
                "message": "Please set ZOHO_API_KEY environment variable in Vercel"
            }

        pdf_url = data.get("pdf_url", "")
        if not pdf_url:
            return {"error": "pdf_url is required"}

        try:
            url = f"{ZOHO_BASE_URL}/document"
            
            document_config = {
                "document_info": {
                    "document_name": data.get("document_name", "Resume"),
                    "document_url": pdf_url
                },
                "editor_settings": {
                    "language": "en",
                    "country": "US"
                },
                "permissions": {
                    "document.edit": True,
                    "document.print": True,
                    "document.download": True
                }
            }

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Zoho-oauthtoken {ZOHO_API_KEY}"
            }

            req = urllib.request.Request(
                url,
                data=json.dumps(document_config).encode(),
                headers=headers,
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode())
                return {
                    "success": True,
                    "editor_url": result.get("document_url", ""),
                    "session_id": result.get("session_id", ""),
                    "document_id": result.get("document_id", "")
                }

        except urllib.error.HTTPError as e:
            error_body = e.read().decode() if e.fp else str(e)
            return {"error": f"Zoho API error: {error_body}"}
        except Exception as e:
            return {"error": str(e)}
