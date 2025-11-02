# Docker: Build & Run (single image)

This file contains Docker build and run commands to create a single image that bundles the React client, the Express server, and the seeded SQLite database (DB is created at image build time by `server/setupDatabase.js`). These commands are PowerShell-friendly for Windows.

## 1) Build the image

Run in the project root (where `Dockerfile` is located):

```powershell
docker build -t sqli-lab:latest .
```

## 2) Run the container (embedded DB in image)

```powershell
docker run --rm -p 5000:5000 --name sqli-single sqli-lab:latest
```

Open your browser at: http://localhost:5000

Notes:
- The server listens on port 5000 inside the container and serves the React build as static files.
- If you want to run the React dev server (port 3000) during development, use local npm scripts instead of the Docker image.

## 3) (Optional) Run with a host-mounted DB file (persist DB on host)

PowerShell example (replace host path as needed):

```powershell
# Create a host folder for the DB (one-time)
New-Item -ItemType Directory -Path C:\sqli_data

# Run container mounting the host DB file location
docker run --rm -p 5000:5000 --name sqli-single -v C:\sqli_data\sqli_lab.db:C:\app\server\sqli_lab.db sqli-lab:latest
```

If Docker Desktop uses WSL2, you can alternatively use WSL-style paths such as `/c/Users/you/...`.

If you see path or permission errors:
- Ensure the host folder is shared with Docker Desktop (Settings → Resources → File Sharing).
- Use a Docker volume instead: `-v sqli_data:/app/server/sqli_lab.db` and manage via `docker volume` commands.

## 4) Rebuild without cache

```powershell
docker build --no-cache -t sqli-lab:latest .
```

## Troubleshooting
- If native module compilation fails during build (e.g., `sqlite3`), ensure Docker build had network access to apt repositories. The Dockerfile includes build tools, but network access is required.
- If the container exits or fails to start, inspect logs:

```powershell
docker logs sqli-single
```

## Next steps (optional)
- I can add a `docker-compose.yml` for easier local orchestration.
- I can retry appending these exact instructions into `README.md` if you'd like the main README updated instead of a separate file.

---
Generated automatically to help run the project in a single Docker image.
