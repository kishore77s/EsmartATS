import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartATS - AI-Powered Resume Screening",
  description:
    "Analyze your resume against job descriptions with AI-powered ATS compatibility scoring. Get instant feedback and improvement suggestions.",
  keywords: [
    "ATS",
    "resume scanner",
    "resume analyzer",
    "job application",
    "AI resume",
    "career",
  ],
  authors: [{ name: "SmartATS" }],
  openGraph: {
    title: "SmartATS - AI-Powered Resume Screening",
    description:
      "Optimize your resume for ATS systems with AI-powered analysis",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
          {/* Header */}
          <header className="sticky top-0 z-50 glass border-b border-slate-200/50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-xl font-bold gradient-text">
                    SmartATS
                  </span>
                </div>

                <div className="hidden md:flex items-center gap-6">
                  <a
                    href="#features"
                    className="text-slate-600 hover:text-primary-600 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-slate-600 hover:text-primary-600 transition-colors"
                  >
                    How It Works
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="bg-slate-900 text-white py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-xl font-bold">SmartATS</span>
                  </div>
                  <p className="text-slate-400 max-w-md">
                    AI-powered resume screening solution that helps job seekers
                    optimize their resumes for Applicant Tracking Systems.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <a href="#" className="hover:text-white transition-colors">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#features" className="hover:text-white transition-colors">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#how-it-works" className="hover:text-white transition-colors">
                        How It Works
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Tech Stack</h4>
                  <ul className="space-y-2 text-slate-400">
                    <li>Next.js + TypeScript</li>
                    <li>FastAPI + Python</li>
                    <li>spaCy + Scikit-learn</li>
                    <li>Tailwind CSS</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
                <p>© 2026 SmartATS. Built with ❤️ for job seekers.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
