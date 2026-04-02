# Sistem Event Lucky Draw

## Tech Stack & Libraries
**Frontend:**
* **Nuxt.js (v4):** Framework utama.
* **@nuxtjs/tailwindcss:** Untuk desain UI yang.

**Backend & Database:**
* **Express.js:** Server API.
* **better-sqlite3:** Database engine (SQLite).
* **cors:**  komunikasi lintas port.

## 1. Prasyarat (Prerequisites)
* **Node.js**: Versi v21+ sangat disarankan.
* **Package Manager**: `npm`.

## 2. Instalasi Dependensi
Anda perlu menginstal dependensi di kedua folder agar aplikasi berjalan sempurna.

**Instal Backend (Express, SQLite, Cors):**

cd backend
npm install express better-sqlite3 cors

**Instal Frontend (tailwind):**
cd frontend
npm install
npm install -D @nuxtjs/tailwindcss

**Konfigurasi Tailwind**
Pastikan modul Tailwind sudah terdaftar di file frontend/nuxt.config.ts:
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss']
})

**Menjalankan Backend**
cd backend
node app.js

**Menjalankan Frontend**
cd frontend
npm run dev