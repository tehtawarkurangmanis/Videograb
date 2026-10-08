# VideoGrab — Render

Versi ini mempertahankan frontend VideoGrab dan menambahkan backend Node.js/Express.

## Struktur
- `index.html` — halaman website
- `style.css` — desain responsive
- `script.js` — validasi URL dan request ke backend
- `server.js` — server Express + API
- `package.json` — dependency dan start command
- `render.yaml` — konfigurasi deploy Render

## Menjalankan lokal
```bash
npm install
npm start
```

Buka `http://localhost:10000`.

## Deploy ke Render
Cara termudah:
1. Upload proyek ini ke repository GitHub.
2. Di Render pilih **New → Web Service**.
3. Hubungkan repository tersebut.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Pilih Free untuk tahap pengujian.
7. Deploy.

## API saat ini
- `GET /api/health`
- `POST /api/info` dengan body JSON:
  `{ "url": "https://..." }`

Endpoint `/api/info` saat ini hanya memvalidasi dan mendeteksi platform. Mesin pengambilan media belum diaktifkan.

Gunakan layanan hanya untuk konten yang memang kamu berhak unduh dan jangan gunakan untuk melewati login, DRM, paywall, atau kontrol akses platform.
