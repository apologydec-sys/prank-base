# AKanni x — Serious Matrix Prank (Django)

A fictional, browser-only cybersecurity simulation with a serious Matrix-inspired interface and a playful reveal. It does not inspect, access, encrypt, modify, delete, or upload visitors' files and does not collect credentials or personal information.

## Run locally on Windows

From the folder containing `manage.py`, open Command Prompt and run:

```bat
py -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
python manage.py check
python manage.py runserver
```

Open `http://127.0.0.1:8000/`. Press `Ctrl+C` to stop the server.

## Deploy to Render (no hosted database required)

This project has no database-backed features and does not require PostgreSQL, Cloudinary, a persistent disk, or a Render Shell session. Static files are collected during the Render build and served by WhiteNoise.

1. Upload the project files to a GitHub repository (do not upload `.venv`, `__pycache__`, or secrets).
2. In Render, choose **New + → Blueprint** and connect that repository, or create a Python Web Service with the commands below.
3. The included `render.yaml` defines the free web service, generated `DJANGO_SECRET_KEY`, production debug setting, allowed Render hosts, static-file build step, start command, and health check.

**Build command**

```sh
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

**Start command**

```sh
gunicorn matrixprank.wsgi:application --bind 0.0.0.0:$PORT
```

The Render free service can sleep when idle and take time to wake. Its local filesystem is ephemeral; this project intentionally stores no visitor data, so no persistent disk or hosted database is needed.
"# prank-base" 
