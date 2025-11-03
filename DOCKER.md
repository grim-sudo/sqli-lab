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

### Problem: "Cannot connect to the Docker daemon" / "The system cannot find the file specified"

**Error message:**
```
ERROR: error during connect: Head "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/_ping": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

**Solution (Windows):**

1. **Check if Docker Desktop is running:**
   ```powershell
   # Check Docker status
   docker info
   ```

2. **Start Docker Desktop:**
   - Open Docker Desktop from the Start menu or system tray
   - Wait for Docker Desktop to fully start (whale icon should be stable in system tray)
   - Verify it's running:
   ```powershell
   docker ps
   ```

3. **If Docker Desktop won't start:**
   - Restart Docker Desktop service:
   ```powershell
   # As Administrator
   Restart-Service -Name "com.docker.service"
   ```
   - Or restart Docker Desktop from Task Manager or Settings

4. **Verify Docker Desktop is configured:**
   - Open Docker Desktop → Settings → General
   - Ensure "Use the WSL 2 based engine" is checked (if using WSL2)
   - Ensure "Start Docker Desktop when you log in" is enabled (optional)

### Problem: Native module compilation fails during build

If native module compilation fails during build (e.g., `sqlite3`), ensure Docker build had network access to apt repositories. The Dockerfile includes build tools, but network access is required.

### Problem: Container exits or fails to start

Inspect logs:
```powershell
docker logs sqli-single
```

## Next steps (optional)
- I can add a `docker-compose.yml` for easier local orchestration.
- I can retry appending these exact instructions into `README.md` if you'd like the main README updated instead of a separate file.

---
Generated automatically to help run the project in a single Docker image.
