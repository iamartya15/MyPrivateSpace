# MyPrivateSpace 🔐

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tesseract.js](https://img.shields.io/badge/OCR-Tesseract.js-orange)

A completely **private**, **offline-first** notes app. No backend, no cloud database — everything runs locally in your browser, and each user's data stays isolated on their own device.

## ✨ Features

- 📝 Rich markdown notes with formatting
- 🎨 Color-coded notes, 📌 pinning, 🏷️ labels & tags
- ☑️ Checklists and 🔍 full-text search
- 📷 **Camera capture** — snap a photo and save it as a note
- 🔤 **OCR (Tesseract.js)** — extract text from images automatically
- 🔒 Lock individual notes with a password
- 🗑️ Trash with auto-empty

## 🔐 Privacy & Auth

- ✅ **Email/Password auth** — localStorage-based, no cloud account needed
- ✅ **Google OAuth** — optional single sign-on
- ✅ **100% private** — notes never leave the device; there is no server to leak them

## 🛠️ Tech Stack

React · TypeScript · Vite · Tailwind CSS · Radix UI · Tesseract.js · Google OAuth (`@react-oauth/google`)

## 🚀 Getting Started

```bash
npm install     # install dependencies
npm run dev     # start the development server
npm run build   # production build
npm run preview # preview the production build
```
