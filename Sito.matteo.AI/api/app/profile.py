"""Public profile served to AI agents (MCP tools and /llms.txt).

Keep it in step with the site texts in frontend/src/i18n/translations.js and with the CV.
"""

SITE_URL = "https://matteobertotti.tech"

PROFILE = {
    "name": "Matteo Augustinho Bertotti",
    "headline": "Junior AI & Software Developer",
    "location": "Verona, Italy",
    "summary": (
        "AI & Software Developer building multi-agent AI systems, intelligent process automations and "
        "enterprise applications in C# (.NET 10) and Python. Develops vertical ERP software and AI "
        "integrations for industrial clients while completing an EQF 5 Higher Technical Diploma in AI Development."
    ),
    "experience": [
        {
            "role": "Junior AI & Software Developer",
            "company": "Metline S.r.l. (Gruppo Maestrale)",
            "location": "Verona, Italy",
            "period": "Jun 2026 - present",
            "highlights": [
                "Custom vertical software, SaaS platforms and on-premise enterprise applications in C# (.NET 10) "
                "and SQL Server with the proprietary Gruppo Maestrale framework.",
                "Multi-agent AI solutions and automated workflows for industrial operations, logistics and rail "
                "transport management.",
                "Refactoring and maintenance of production C# codebases for industrial clients.",
                "Python and SQL pipelines to monitor operational and logistics KPIs.",
            ],
        },
        {
            "role": "Food & Beverage Specialist",
            "period": "Apr 2023 - Dec 2025",
            "highlights": ["Autonomous service operations and workflow optimisation across multi-site teams."],
        },
    ],
    "education": [
        {
            "school": 'ITS Digital Academy "Mario Volpato"',
            "course": "Artificial Intelligence Developer and Data Analyst - Higher Technical Diploma (EQF 5)",
            "period": "Nov 2025 - Jul 2027 (expected)",
            "focus": "Generative AI, Machine & Deep Learning, Predictive Modeling, Big Data Management, Python",
        }
    ],
    "skills": {
        "languages": ["C#", "Python", "SQL", "JavaScript", "HTML/CSS"],
        "ai": ["Multi-Agent Systems", "Generative AI", "Prompt Engineering", "MCP", "Deep Learning", "PyTorch", "Scikit-learn"],
        "backend": [".NET 10", "ASP.NET Core", "FastAPI", "REST APIs", "OAuth 2.0", "React"],
        "data_devops": ["SQL Server", "PostgreSQL", "MySQL", "Pandas", "Docker", "Git", "GitHub Actions", "Linux"],
    },
    "spoken_languages": ["Italian (native)", "Portuguese (native)", "English (B2, EF SET)"],
    "certifications": [
        "Python Developer Certification (freeCodeCamp)",
        "B1 English for Developers (freeCodeCamp)",
        "MySQL & SQL Server",
        "Advanced Excel",
    ],
    "contacts": {
        "website": SITE_URL,
        "email": "matteobertotti@icloud.com",
        "linkedin": "https://www.linkedin.com/in/matteo-augustinho-bertotti/",
        "github": "https://github.com/Matteo019",
    },
}

PROJECTS = [
    {
        "name": "AKID Chatbox",
        "summary": "Multi-agent AI chatbot for data and KPI analysis, with MCP integration to SQL databases and LLMs via NVIDIA NIM and Groq.",
        "stack": ["FastAPI", "Groq", "MCP", "Python", "SQL", "NVIDIA NIM"],
        "status": "demo coming soon",
    },
    {
        "name": "Bar Inventory Management (Dispensa)",
        "summary": "Full-stack inventory app for a bar: stock in/out, dashboard, history, role-based users. ASP.NET Core (.NET 10) API and PostgreSQL on Docker.",
        "stack": ["C#", "ASP.NET Core", "PostgreSQL", "EF Core", "Docker", "JavaScript"],
        "url": "https://dispensabar.matteobertotti.tech/",
        "status": "live (demo account test / test)",
    },
    {
        "name": "Trascrizioni AI",
        "summary": "Windows app for real-time transcription of lectures and PC audio with Whisper, AI summaries in Markdown and chat over past sessions.",
        "stack": ["Python", "FastAPI", "Whisper", "Groq", "LLM"],
        "url": "https://github.com/Matteo019/trascrizioni",
        "status": "desktop app",
    },
    {
        "name": "Home Server & CI/CD",
        "summary": "Self-hosted Ubuntu server running this site: Docker containers, GitHub Actions deploys with a self-hosted runner, Cloudflare Tunnel, Tailscale.",
        "stack": ["Ubuntu", "Docker", "GitHub Actions", "Cloudflare", "Nginx", "Tailscale"],
        "status": "live",
    },
    {
        "name": "Mental Health & Work",
        "summary": "Guided cleaning and analysis of a 1500-row CSV dataset with Python, step by step.",
        "stack": ["Python", "Pandas", "Seaborn", "Matplotlib"],
        "status": "interactive notebook on the site",
    },
]
