
## SatQuery Medium connectivity and deployment

The browser calls FastAPI directly. Configure the one frontend backend URL through `NEXT_PUBLIC_BACKEND_URL`; there is no Netlify proxy or backend deployment. The value is read when Next.js starts/builds, so restart the dev server after changing `.env.local` and trigger a new Netlify deploy after changing the Netlify variable.

### Local development

1. From the project root, start FastAPI: `python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000`.
2. In `frontend/.env.local`, set `NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000` when the browser and backend share the same machine. To test via the public tunnel instead, set it to the current `https://<cloudflare-tunnel-url>`.
3. From `frontend/`, run `npm run dev`.
4. Verify `GET $NEXT_PUBLIC_BACKEND_URL/health` and upload an image in the UI; the upload is sent as `multipart/form-data` with field `image` to `/analyze`.

`.env.local` is ignored by Git. `.env.example` is a placeholder and contains no live endpoint.

### Netlify

1. Push the frontend repository to GitHub and connect that repository to Netlify. The frontend build uses the standard Next.js preset; no backend files or Raspberry Pi filesystem are needed on Netlify.
2. In Netlify site environment variables, create `NEXT_PUBLIC_BACKEND_URL` with the current HTTPS backend tunnel URL (or a permanent HTTPS backend domain).
3. Add the Netlify site origin to `SATQUERY_CORS_ORIGINS` on the Raspberry Pi, then restart FastAPI. Include local origins if local browser development is also needed.
4. Deploy. Verify the deployed browser can open `${NEXT_PUBLIC_BACKEND_URL}/health`, then upload an image and confirm the browser request to `/analyze` succeeds.

### Raspberry Pi and Cloudflare Tunnel

Run FastAPI locally on the Pi with `python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000`. Configure `SATQUERY_CORS_ORIGINS` as comma-separated browser origins, for example `https://your-site.netlify.app,http://localhost:3000,http://127.0.0.1:3000`. Start `cloudflared` to publish the local service at `http://127.0.0.1:8000`, and keep the tunnel process running. When using a Quick Tunnel, update the frontend environment value whenever its temporary URL changes, then restart/redeploy the frontend. A Cloudflare Named Tunnel with a custom domain is recommended for production stability. Cloudflare is only the transport layer; FastAPI continues to run locally on the Pi.

### Push only the frontend

From `frontend/`, review `git status`, then run `git add .`, `git commit -m "Configure SatQuery backend connectivity"`, and `git push`. The ignore rules exclude `.env.local`, dependencies, build output, Python virtual environments, and Python bytecode.
