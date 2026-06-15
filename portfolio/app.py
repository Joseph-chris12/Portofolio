import streamlit as st
from PIL import Image
import os

# ─────────────────────────────────────────────
#  PAGE CONFIG
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="Jocep · Portfolio",
    page_icon="🎧",
    layout="wide",
)

# ─────────────────────────────────────────────
#  ✏️  EDIT YOUR INFO HERE
# ─────────────────────────────────────────────
NAME        = "Josep"
TAGLINE     = "Undergraduate · Builder · Curious mind"
BIO         = (
    "Hi! I'm Josep, an Information Systems student at Binus University. "
    "I enjoy building things at the intersection of data, finance, and technology — "
    "from machine learning stock predictors to marketplace platforms and music recommenders."
)
LOCATION    = "Semarang, Indonesia"
EMAIL       = ""                            # fill in if you want
GITHUB_URL  = "https://github.com/Joseph-chris12"
INSTAGRAM   = "https://www.instagram.com/joseph.ck12"
AVATAR_URL  = "https://avatars.githubusercontent.com/u/151103519?v=4"

# ── SKILLS ──────────────────────────────────
SKILLS = [
    "Python", "JavaScript", "HTML/CSS", "PHP",
    "Streamlit", "Flask", "Pandas", "Scikit-learn",
    "PLS-SEM", "Machine Learning", "Data Analysis",
    "SQL", "Power BI / Excel", "Git",
]

# ── PROJECTS ────────────────────────────────
PROJECTS = [
    {
        "title": "SoundCore",
        "emoji": "🎧",
        "desc": (
            "Music recommendation system using content-based filtering and Spotify audio features. "
            "Cosine similarity engine with mood-based presets."
        ),
        "tech": ["Python", "JavaScript", "Machine Learning", "Spotify API"],
        "url": "https://github.com/Joseph-chris12/SoundCore",
    },
    {
        "title": "projectStockPrice",
        "emoji": "📈",
        "desc": (
            "Stock price visualisation tool for Indonesian IDX stocks. "
            "Originally Flask-based, converted to a static GitHub Pages site."
        ),
        "tech": ["Python", "Flask", "JavaScript", "IDX Data"],
        "url": "https://github.com/Joseph-chris12/projectStockPrice",
    },
    {
        "title": "Thrivea",
        "emoji": "🌱",
        "desc": (
            "Web application project built with HTML. "
            "A wellness-oriented platform focusing on personal growth."
        ),
        "tech": ["HTML", "CSS", "JavaScript"],
        "url": "https://github.com/Joseph-chris12/Thrivea",
    },
    {
        "title": "PasarKita",
        "emoji": "🛒",
        "desc": (
            "Web-based marketplace platform designed for Indonesian UMKM businesses. "
            "Features an Event Calendar and digital proposal workflow."
        ),
        "tech": ["Web Dev", "UX Design", "PRD"],
        "url": "#",   # update when live
    },
    {
        "title": "Valentine's Web",
        "emoji": "💌",
        "desc": (
            "A cute interactive web page — a personal Valentine's Day surprise "
            "built with pure HTML/CSS/JS."
        ),
        "tech": ["HTML", "CSS", "JavaScript"],
        "url": "https://github.com/Joseph-chris12/Valentines_for_my_gf_hehe",
    },
    {
        "title": "App Modernization on GCP",
        "emoji": "☁️",
        "desc": (
            "Participated in a GCP application modernisation workshop. "
            "Hands-on with cloud infrastructure and PHP modernisation patterns."
        ),
        "tech": ["PHP", "GCP", "Cloud"],
        "url": "https://github.com/Joseph-chris12/app-mod-workshop",
    },
]

# ── EVENTS / PHOTOS ─────────────────────────
# Add your events here. For each event, provide:
#   "title", "date", "desc", and optionally "image" (path to a local image file)
EVENTS = [
    {
        "title": "Google Cloud Study Jam",
        "date": "2024",
        "desc": "Participated in an application modernisation workshop on Google Cloud Platform.",
        "image": None,   # e.g. "images/studyjam.jpg"
    },
    {
        "title": "Behavioral Finance Research",
        "date": "2024",
        "desc": "Presented research on FOMO and herding behavior among Gen Z investors using PLS-SEM & ML.",
        "image": None,
    },
    # ➕ Add more events below ⬇️
]

# ─────────────────────────────────────────────
#  STYLING
# ─────────────────────────────────────────────
st.markdown("""
<style>
    /* Global font & background */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    .main { background: #0f1117; }

    /* Hero */
    .hero-name {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 3.2rem;
        font-weight: 700;
        color: #EAEAEA;
        line-height: 1.1;
        margin-bottom: 0.2rem;
    }
    .hero-tagline {
        font-size: 1.1rem;
        color: #6EE7B7;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        font-weight: 500;
        margin-bottom: 1rem;
    }
    .hero-bio {
        font-size: 1rem;
        color: #A0AEC0;
        line-height: 1.75;
        max-width: 520px;
    }

    /* Section headers */
    .section-label {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.75rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #6EE7B7;
        margin-bottom: 0.5rem;
    }
    .section-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.8rem;
        font-weight: 700;
        color: #EAEAEA;
        margin-bottom: 1.5rem;
    }

    /* Project cards */
    .proj-card {
        background: #1A1D27;
        border: 1px solid #2D3748;
        border-radius: 12px;
        padding: 1.4rem 1.6rem;
        height: 100%;
        transition: border-color 0.2s;
    }
    .proj-card:hover { border-color: #6EE7B7; }
    .proj-emoji { font-size: 1.8rem; margin-bottom: 0.6rem; }
    .proj-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.05rem;
        font-weight: 600;
        color: #EAEAEA;
        margin-bottom: 0.4rem;
    }
    .proj-desc { font-size: 0.875rem; color: #718096; line-height: 1.6; margin-bottom: 0.8rem; }
    .tech-tag {
        display: inline-block;
        background: #2D3748;
        color: #A0AEC0;
        font-size: 0.72rem;
        padding: 2px 8px;
        border-radius: 20px;
        margin: 2px 2px 0 0;
    }

    /* Skill pills */
    .skill-pill {
        display: inline-block;
        background: #1A1D27;
        border: 1px solid #2D3748;
        color: #CBD5E0;
        font-size: 0.83rem;
        padding: 5px 14px;
        border-radius: 20px;
        margin: 4px 4px;
    }

    /* Event cards */
    .event-card {
        background: #1A1D27;
        border: 1px solid #2D3748;
        border-radius: 12px;
        padding: 1.2rem 1.4rem;
        margin-bottom: 1rem;
    }
    .event-title { font-weight: 600; color: #EAEAEA; font-size: 1rem; }
    .event-date { font-size: 0.78rem; color: #6EE7B7; margin-bottom: 0.4rem; }
    .event-desc { font-size: 0.875rem; color: #718096; }

    /* Social links */
    .social-btn {
        display: inline-block;
        background: #1A1D27;
        border: 1px solid #2D3748;
        color: #CBD5E0 !important;
        text-decoration: none !important;
        padding: 8px 18px;
        border-radius: 8px;
        font-size: 0.875rem;
        margin-right: 8px;
        margin-top: 8px;
    }
    .social-btn:hover { border-color: #6EE7B7; color: #6EE7B7 !important; }

    /* Divider */
    .my-divider { border-top: 1px solid #2D3748; margin: 2.5rem 0; }

    /* Hide default streamlit chrome */
    #MainMenu, footer, header { visibility: hidden; }
    .block-container { padding-top: 2.5rem; padding-bottom: 3rem; max-width: 1100px; }
</style>
""", unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  HERO
# ─────────────────────────────────────────────
col_avatar, col_text = st.columns([1, 3], gap="large")

with col_avatar:
    st.markdown(f'<img src="{AVATAR_URL}" style="width:160px;height:160px;border-radius:50%;border:3px solid #6EE7B7;display:block;margin:auto;" />', unsafe_allow_html=True)

with col_text:
    st.markdown(f'<div class="hero-name">{NAME}</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="hero-tagline">{TAGLINE}</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="hero-bio">{BIO}</div>', unsafe_allow_html=True)
    st.markdown(f"""
        <div style="margin-top:1.2rem;">
            <a class="social-btn" href="{GITHUB_URL}" target="_blank">🐙 GitHub</a>
            <a class="social-btn" href="{INSTAGRAM}" target="_blank">📸 Instagram</a>
            {'<a class="social-btn" href="mailto:'+EMAIL+'">✉️ Email</a>' if EMAIL else ''}
        </div>
    """, unsafe_allow_html=True)

st.markdown('<div class="my-divider"></div>', unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  SKILLS
# ─────────────────────────────────────────────
st.markdown('<div class="section-label">What I work with</div>', unsafe_allow_html=True)
st.markdown('<div class="section-title">Skills & Tools</div>', unsafe_allow_html=True)

pills_html = "".join(f'<span class="skill-pill">{s}</span>' for s in SKILLS)
st.markdown(f'<div style="margin-bottom:0.5rem;">{pills_html}</div>', unsafe_allow_html=True)

st.markdown('<div class="my-divider"></div>', unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  PROJECTS
# ─────────────────────────────────────────────
st.markdown('<div class="section-label">Things I\'ve built</div>', unsafe_allow_html=True)
st.markdown('<div class="section-title">Projects</div>', unsafe_allow_html=True)

cols = st.columns(3, gap="medium")
for i, proj in enumerate(PROJECTS):
    tags_html = "".join(f'<span class="tech-tag">{t}</span>' for t in proj["tech"])
    link = f'<a href="{proj["url"]}" target="_blank" style="font-size:0.8rem;color:#6EE7B7;text-decoration:none;">View →</a>' if proj["url"] != "#" else ""
    with cols[i % 3]:
        st.markdown(f"""
        <div class="proj-card">
            <div class="proj-emoji">{proj['emoji']}</div>
            <div class="proj-title">{proj['title']}</div>
            <div class="proj-desc">{proj['desc']}</div>
            <div>{tags_html}</div>
            <div style="margin-top:0.8rem;">{link}</div>
        </div>
        """, unsafe_allow_html=True)

st.markdown('<div class="my-divider"></div>', unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  EVENTS / GALLERY
# ─────────────────────────────────────────────
st.markdown('<div class="section-label">Moments & Milestones</div>', unsafe_allow_html=True)
st.markdown('<div class="section-title">Events</div>', unsafe_allow_html=True)

# ── Upload section (so you can add photos later) ──
with st.expander("➕ Add a new event photo"):
    ev_title = st.text_input("Event title")
    ev_date  = st.text_input("Date (e.g. June 2025)")
    ev_desc  = st.text_area("Short description")
    ev_img   = st.file_uploader("Upload a photo (optional)", type=["jpg", "jpeg", "png"])

    if st.button("Add to session") and ev_title:
        st.session_state.setdefault("extra_events", []).append({
            "title": ev_title,
            "date": ev_date,
            "desc": ev_desc,
            "uploaded_image": ev_img,
        })
        st.success(f"Added {ev_title} — scroll down to see it!")

# ── Render hardcoded events ──
all_events = EVENTS + st.session_state.get("extra_events", [])

if not all_events:
    st.markdown('<p style="color:#718096;">No events yet — add one above! 📸</p>', unsafe_allow_html=True)
else:
    ev_cols = st.columns(2, gap="medium")
    for i, ev in enumerate(all_events):
        with ev_cols[i % 2]:
            # Show image if available
            img_path = ev.get("image")
            uploaded = ev.get("uploaded_image")
            if uploaded:
                st.image(uploaded, use_container_width=True)
            elif img_path and os.path.exists(img_path):
                st.image(img_path, use_container_width=True)
            # Card text
            st.markdown(f"""
            <div class="event-card">
                <div class="event-date">{ev['date']}</div>
                <div class="event-title">{ev['title']}</div>
                <div class="event-desc" style="margin-top:0.3rem;">{ev['desc']}</div>
            </div>
            """, unsafe_allow_html=True)

# ─────────────────────────────────────────────
#  FOOTER
# ─────────────────────────────────────────────
st.markdown('<div class="my-divider"></div>', unsafe_allow_html=True)
st.markdown(
    '<p style="text-align:center;color:#4A5568;font-size:0.8rem;">Built with ❤️ by Josep · '
    f'<a href="{GITHUB_URL}" style="color:#6EE7B7;text-decoration:none;">github.com/Joseph-chris12</a></p>',
    unsafe_allow_html=True
)
