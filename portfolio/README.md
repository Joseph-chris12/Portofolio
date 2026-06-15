# 🗂️ Jocep's Portfolio — Streamlit App

## Run locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

## How to edit

All editable content is at the **top of `app.py`** in clearly labelled sections:

| Section | What to edit |
|---|---|
| `NAME`, `TAGLINE`, `BIO` | Your personal intro |
| `EMAIL` | Add your email if you want a contact link |
| `SKILLS` | Add / remove skill tags |
| `PROJECTS` | Edit or add project cards (title, emoji, desc, tech, url) |
| `EVENTS` | Add hardcoded events with an optional local image path |

## Adding event photos

**Option A — hardcode (permanent):**
1. Put your photo in an `images/` folder next to `app.py`
2. Add an entry to `EVENTS` list with `"image": "images/yourphoto.jpg"`

**Option B — upload at runtime:**
Click "➕ Add a new event photo" on the Events section while the app is running. Photos added this way last for the browser session.

## Deploy for free

1. Push this folder to a GitHub repo
2. Go to [share.streamlit.io](https://share.streamlit.io) → connect your repo → deploy 🚀
