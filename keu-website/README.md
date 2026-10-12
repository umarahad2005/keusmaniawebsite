# keu-website

The Vite + React site for **Karwan e Usmania International** (https://usmania.vercel.app).

Full documentation — stack, setup, environment variables, scripts, the admin and deployment — is in the [repository README](../README.md).

```bash
npm install
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:5173 (site) + :3001 (API)
npm run build          # production build + sitemap, robots.txt, llms.txt
```

After adding photos in the admin: `npm run warm:images`.
