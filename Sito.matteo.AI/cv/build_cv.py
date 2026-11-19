"""Builds Matteo's one-page, ATS-friendly CV (A4) in English and Italian with ReportLab.

Usage (from Sito.matteo.AI):  python cv/build_cv.py
Writes both PDFs into frontend/public/images/, where the site serves them:
the page in English links the English CV, the page in Italian the Italian one.

Single column, real text (no images or tables of text), bold for emphasis instead of
highlight boxes (those insert spaces in the text that ATS software extracts).
Requires: pip install reportlab
"""

import re
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUT_DIR = Path(__file__).resolve().parents[1] / "frontend" / "public" / "images"
FILES = {
    "en": "CV_MatteoBertotti_AI-SoftwareDeveloper_Verona.pdf",
    "it": "CV_MatteoBertotti_AI-SoftwareDeveloper_Verona_IT.pdf",
}

# ---------------------------------------------------------------- content

CONTACT = [
    "+39 392 183 1641 | matteobertotti@icloud.com | Verona, Italy",
    "matteobertotti.tech | linkedin.com/in/matteo-augustinho-bertotti | github.com/Matteo019",
]

CV = {
    "en": {
        "headline": "AI &amp; Software Developer | Multi-Agent Systems, .NET &amp; Python Backend",
        "contact": CONTACT,
        "sections": {"summary": "Summary", "experience": "Experience", "projects": "Projects",
                     "skills": "Technical Skills", "education": "Education", "certs": "Certifications & Languages"},
        "summary": (
            "AI &amp; Software Developer building [[multi-agent AI systems]], intelligent process automations and enterprise "
            "backend applications in [[C# (.NET 10)]] and <b>Python</b>. Currently developing <b>vertical ERP software and AI "
            "integrations</b> for <b>industrial clients</b> while completing a Higher Technical Diploma (EQF 5) in AI Development. "
            "Focused on <b>scalable AI-powered software</b> and production backend architectures."),
        "jobs": [
            ("Junior AI &amp; Software Developer", "Jun 2026 – Present", "Metline S.r.l. (Gruppo Maestrale)", "Verona, Italy", [
                "Develop <b>custom vertical software, SaaS platforms and on-premise enterprise applications</b> in [[C# (.NET 10)]] "
                "and [[SQL Server]], using the proprietary Gruppo Maestrale framework.",
                "Trained on and work with the [[Panthera ERP]].",
                "Build [[multi-agent AI solutions]] and automated workflows for <b>industrial operations, logistics and rail "
                "transport</b> management.",
                "Refactor and maintain [[production C# codebases]] for industrial clients, moving projects from <b>AI-assisted "
                "prototyping to full enterprise implementation</b>.",
                "Develop <b>Python and SQL pipelines</b> to monitor operational and logistics [[KPIs]].",
            ]),
            ("Food &amp; Beverage Specialist", "Apr 2023 – Dec 2025", None, None, [
                "Managed autonomous service operations and workflow optimization in high-pressure environments, coordinating "
                "across <b>multi-site teams</b>.",
            ]),
        ],
        "projects": [
            ("Trascrizioni", "Real-Time Audio AI &amp; LLM Pipeline", "github.com/Matteo019/trascrizioni", [
                "End-to-end [[real-time speech-to-text]] and automated <b>summarization</b> system for lectures and Microsoft "
                "Teams calls, combining <b>Silero VAD, Whisper (Groq) and NVIDIA NIM APIs</b> for low-latency transcription and "
                "structured summaries <i>(Python, FastAPI, Whisper, LLM APIs)</i>.",
            ]),
            ("Portfolio Platform", "Backend, AI Integration &amp; Self-Hosted Infrastructure", "matteobertotti.tech", [
                "[[FastAPI and PostgreSQL]] backend with authenticated admin area, contact pipeline and a read-only "
                "<b>MCP server</b> that exposes my profile and posts to AI assistants.",
                "Self-hosted on an <b>Ubuntu home server</b> with <b>Docker Compose, Nginx and Cloudflare Tunnel</b>; automated "
                "[[CI/CD]] with GitHub Actions on a self-hosted runner; remote access via Tailscale.",
            ]),
            ("Bar Inventory Management", "Backend &amp; API", "dispensabar.matteobertotti.tech", [
                "Inventory management system with <b>role-based users, stock movements and dashboard</b>; REST API in "
                "[[ASP.NET Core (.NET 10)]] with EF Core and PostgreSQL, containerized with Docker.",
            ]),
            ("FocusFlow", "Backend &amp; API Architecture", "", [
                "<b>REST API platform</b> in Python (<b>FastAPI</b>) for task management, with [[OAuth 2.0]] authentication "
                "and two-way integration with <b>Google and Microsoft</b> ecosystems.",
            ]),
        ],
        "skills": [
            ("Languages", "C#, Python, SQL"),
            ("AI &amp; Agents", "Multi-Agent Systems, Generative AI, LLM APIs, Prompt Engineering, MCP"),
            ("Backend", ".NET 10, ASP.NET Core, EF Core, FastAPI, REST APIs, OAuth 2.0"),
            ("Data &amp; DevOps", "SQL Server, PostgreSQL, MySQL, Pandas, Docker, Git, GitHub Actions, Linux"),
        ],
        "education": [
            ('ITS Digital Academy “Mario Volpato”', "Nov 2025 – Jul 2027 (expected)",
             "Higher Technical Diploma (EQF 5) – AI Development",
             "Focus: Generative AI, Machine &amp; Deep Learning, Predictive Modeling, Big Data Management, Python Development."),
            ("E.E.M. Vereador Oscar Manoel da Conceição", "2019 – 2021",
             "High School Diploma (Ensino Médio – General Track)", None),
        ],
        "certs": ("Certifications", "Python Developer Certification (freeCodeCamp, May 2026 – 300h), B1 English for Developers "
                  "(freeCodeCamp, Jul 2026), Relational Databases (Accademia Domani), Microsoft Excel (Accademia Domani)"),
        "langs": ("Languages", "Italian (Native), Portuguese (Native), English (B2 – EF SET)"),
        # European consent: the EU regulation only
        "privacy": "I consent to the processing of the personal data contained in this CV for recruitment purposes, "
                   "in accordance with Regulation (EU) 2016/679 (General Data Protection Regulation).",
        "meta_subject": "AI & Software Developer",
    },
    "it": {
        "headline": "AI &amp; Software Developer | Sistemi multi-agente, backend .NET e Python",
        "contact": [CONTACT[0].replace("Italy", "Italia"), CONTACT[1]],
        "sections": {"summary": "Profilo", "experience": "Esperienza", "projects": "Progetti",
                     "skills": "Competenze tecniche", "education": "Formazione", "certs": "Certificazioni e lingue"},
        "summary": (
            "AI &amp; Software Developer: sviluppo [[sistemi AI multi-agente]], automazioni intelligenti dei processi e "
            "applicazioni backend enterprise in [[C# (.NET 10)]] e <b>Python</b>. Oggi lavoro su <b>software gestionale "
            "verticale e integrazioni AI</b> per <b>clienti industriali</b>, mentre completo il diploma ITS (EQF 5) in AI "
            "Development. Il mio obiettivo è realizzare <b>software scalabile basato sull'AI</b> e architetture backend pronte "
            "per la produzione."),
        "jobs": [
            ("Junior AI &amp; Software Developer", "Giu 2026 – Presente", "Metline S.r.l. (Gruppo Maestrale)", "Verona", [
                "Sviluppo <b>software verticale su misura, piattaforme SaaS e applicazioni enterprise on-premise</b> in "
                "[[C# (.NET 10)]] e [[SQL Server]], con il framework proprietario del Gruppo Maestrale.",
                "Formazione e lavoro quotidiano sull'[[ERP Panthera]].",
                "Realizzo [[soluzioni AI multi-agente]] e flussi automatizzati per <b>operazioni industriali, logistica e "
                "trasporto ferroviario</b>.",
                "Rifattorizzo e mantengo [[codice C# in produzione]] per clienti industriali, portando i progetti dal "
                "<b>prototipo sviluppato con l'AI all'implementazione enterprise completa</b>.",
                "Sviluppo <b>pipeline Python e SQL</b> per monitorare i [[KPI]] operativi e logistici.",
            ]),
            ("Food &amp; Beverage Specialist", "Apr 2023 – Dic 2025", None, None, [
                "Gestione autonoma del servizio e ottimizzazione dei flussi di lavoro in contesti ad alta pressione, "
                "coordinandomi con <b>team su più sedi</b>.",
            ]),
        ],
        "projects": [
            ("Trascrizioni", "Pipeline AI audio in tempo reale e LLM", "github.com/Matteo019/trascrizioni", [
                "Sistema completo di [[trascrizione in tempo reale]] e <b>riassunto automatico</b> di lezioni e chiamate "
                "Microsoft Teams, che combina <b>Silero VAD, Whisper (Groq) e le API NVIDIA NIM</b> per trascrizioni a bassa "
                "latenza e riassunti strutturati <i>(Python, FastAPI, Whisper, LLM API)</i>.",
            ]),
            ("Piattaforma portfolio", "Backend, integrazione AI e infrastruttura self-hosted", "matteobertotti.tech", [
                "Backend [[FastAPI e PostgreSQL]] con area admin autenticata, modulo contatti e un <b>server MCP</b> in "
                "sola lettura che rende profilo e post leggibili dagli assistenti AI.",
                "Ospitata sul mio <b>home server Ubuntu</b> con <b>Docker Compose, Nginx e Cloudflare Tunnel</b>; [[CI/CD]] "
                "automatica con GitHub Actions su runner self-hosted; accesso remoto con Tailscale.",
            ]),
            ("Gestione magazzino bar", "Backend e API", "dispensabar.matteobertotti.tech", [
                "Gestionale di magazzino con <b>utenti e ruoli, movimenti di carico e scarico e dashboard</b>; API REST in "
                "[[ASP.NET Core (.NET 10)]] con EF Core e PostgreSQL, containerizzata con Docker.",
            ]),
            ("FocusFlow", "Architettura backend e API", "", [
                "<b>Piattaforma REST API</b> in Python (<b>FastAPI</b>) per la gestione delle attività, con autenticazione "
                "[[OAuth 2.0]] e integrazione bidirezionale con gli ecosistemi <b>Google e Microsoft</b>.",
            ]),
        ],
        "skills": [
            ("Linguaggi", "C#, Python, SQL"),
            ("AI e agenti", "Sistemi multi-agente, AI generativa, LLM API, Prompt Engineering, MCP"),
            ("Backend", ".NET 10, ASP.NET Core, EF Core, FastAPI, REST API, OAuth 2.0"),
            ("Dati e DevOps", "SQL Server, PostgreSQL, MySQL, Pandas, Docker, Git, GitHub Actions, Linux"),
        ],
        "education": [
            ('ITS Digital Academy “Mario Volpato”', "Nov 2025 – Lug 2027 (previsto)",
             "Diploma di Tecnico Superiore (EQF 5) – AI Development",
             "Focus: AI generativa, Machine e Deep Learning, modelli predittivi, Big Data Management, sviluppo Python."),
            ("E.E.M. Vereador Oscar Manoel da Conceição", "2019 – 2021",
             "Diploma di scuola secondaria superiore (Ensino Médio, Brasile)", None),
        ],
        "certs": ("Certificazioni", "Python Developer Certification (freeCodeCamp, mag 2026 – 300 ore), B1 English for "
                  "Developers (freeCodeCamp, lug 2026), Database relazionali (Accademia Domani), Microsoft Excel (Accademia Domani)"),
        "langs": ("Lingue", "Italiano (madrelingua), Portoghese (madrelingua), Inglese (B2 – EF SET)"),
        # Italian consent formula: Italian privacy code + GDPR
        "privacy": "Autorizzo il trattamento dei dati personali contenuti nel mio curriculum vitae ai sensi del D.Lgs. "
                   "196/2003, come modificato dal D.Lgs. 101/2018, e dell'art. 13 del Regolamento (UE) 2016/679 (GDPR).",
        "meta_subject": "AI & Software Developer",
    },
}

# ---------------------------------------------------------------- layout

INK = HexColor("#111111")
MUTED = HexColor("#444444")
# CMU Serif (Computer Modern Unicode, SIL OFL): the LaTeX look, embedded in the PDF
FONTS = Path(__file__).resolve().parent / "fonts"
for font_name, file in [("CMU", "cmu-serif-500-roman.ttf"), ("CMU-Bold", "cmu-serif-700-roman.ttf"),
                        ("CMU-Italic", "cmu-serif-500-italic.ttf"), ("CMU-BoldItalic", "cmu-serif-700-italic.ttf")]:
    pdfmetrics.registerFont(TTFont(font_name, str(FONTS / file)))
pdfmetrics.registerFontFamily("CMU", normal="CMU", bold="CMU-Bold", italic="CMU-Italic", boldItalic="CMU-BoldItalic")
SERIF, SERIF_B, SERIF_I = "CMU", "CMU-Bold", "CMU-Italic"

# Light blue box behind key words, as in the LaTeX version. It is a background colour,
# not a separate box, so the extracted text stays clean ("systems," not "systems ,").
HIGHLIGHT = "#dbe6f4"


def hl(text):
    """[[words]] -> bold words on a light blue background."""
    return re.sub(r"\[\[(.+?)\]\]", lambda m: f'<font backColor="{HIGHLIGHT}"><b>{m.group(1)}</b></font>', text)


base = ParagraphStyle("base", fontName=SERIF, fontSize=9.3, leading=11.0, textColor=INK)
name = ParagraphStyle("name", parent=base, fontSize=22, leading=26, alignment=TA_CENTER)
center = ParagraphStyle("center", parent=base, alignment=TA_CENTER, fontSize=10, leading=12.5)
section = ParagraphStyle("section", parent=base, fontSize=12, leading=14, spaceBefore=5)
role = ParagraphStyle("role", parent=base, fontName=SERIF_B, fontSize=10.6, leading=12.5)
sub = ParagraphStyle("sub", parent=base, fontName=SERIF_I, fontSize=9.4, leading=11.2, textColor=MUTED)
right = ParagraphStyle("right", parent=base, alignment=2)
right_i = ParagraphStyle("right_i", parent=sub, alignment=2)
privacy = ParagraphStyle("privacy", parent=base, fontName=SERIF_I, fontSize=7.8, leading=9.4, textColor=MUTED, spaceBefore=6)


def smallcaps(text, size=12):
    small = f'{size * 0.8:.1f}'
    words = []
    for w in text.split(" "):
        if w.lower() in ("e", "and", "of"):  # conjunctions stay small, like LaTeX 	extsc
            words.append(f'<font size="{small}">{w.upper()}</font>')
        elif w[0].isalpha():
            words.append(f'{w[0].upper()}<font size="{small}">{w[1:].upper()}</font>')
        else:
            words.append(w)
    return " ".join(words)


def build(lang):
    c = CV[lang]
    out = OUT_DIR / FILES[lang]
    doc = SimpleDocTemplate(str(out), pagesize=A4, leftMargin=13 * mm, rightMargin=13 * mm,
                            topMargin=10 * mm, bottomMargin=8 * mm,
                            title="Matteo Augustinho Bertotti - CV", author="Matteo Augustinho Bertotti",
                            subject=c["meta_subject"],
                            keywords="AI, Software Developer, C#, .NET, Python, FastAPI, Multi-Agent Systems")

    def heading(text):
        return [Paragraph(smallcaps(text.replace("&", "&amp;")), section),
                HRFlowable(width="100%", thickness=0.6, color=INK, spaceBefore=1, spaceAfter=3)]

    def row(left, right_text, left_style=role, right_style=right, widths=(0.66, 0.34)):
        t = Table([[Paragraph(left, left_style), Paragraph(right_text, right_style)]],
                  colWidths=[doc.width * widths[0], doc.width * widths[1]])
        t.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                               ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                               ("VALIGN", (0, 0), (-1, -1), "BOTTOM")]))
        return t

    def bullets(items):
        return ListFlowable([ListItem(Paragraph(hl(i), base), leftIndent=11, bulletFontName=SERIF) for i in items],
                            bulletType="bullet", start="•", bulletFontName=SERIF, bulletFontSize=8,
                            leftIndent=11, spaceBefore=1, spaceAfter=3)

    sec = c["sections"]
    s = [Paragraph(smallcaps("Matteo Augustinho Bertotti", 22), name), Paragraph(c["headline"], center)]
    s += [Paragraph(line, center) for line in c["contact"]]

    s += heading(sec["summary"])
    s.append(Paragraph(hl(c["summary"]), base))

    s += heading(sec["experience"])
    for title, period, org, place, items in c["jobs"]:
        s.append(row(title, period))
        if org:
            s.append(row(org, place, sub, right_i))
        s.append(bullets(items))

    s += heading(sec["projects"])
    for title, kind, link, items in c["projects"]:
        s.append(row(f'{title} <font name="{SERIF}" size="9.4">| <i>{kind}</i></font>', link))
        s.append(bullets(items))

    s += heading(sec["skills"])
    s += [Paragraph(f"<b>{label}:</b> {value}", base) for label, value in c["skills"]]
    s.append(Spacer(1, 2))

    s += heading(sec["education"])
    for school, period, degree, focus in c["education"]:
        s.append(row(school, period, widths=(0.6, 0.4)))
        s.append(Paragraph(degree, sub))
        if focus:
            s.append(bullets([focus]))

    s += heading(sec["certs"])
    for label, value in (c["certs"], c["langs"]):
        s.append(Paragraph(f"<b>{label}:</b> {value}", base))
    s.append(Paragraph(c["privacy"], privacy))

    doc.build(s)
    return out


if __name__ == "__main__":
    for lang in CV:
        print(build(lang))
