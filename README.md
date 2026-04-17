# 📝 Markdown Editor & Blogging Platform

> **Student:** Viswa Vardhan | **Reg No:** 12220258  
> An All-in-One Markdown Editor and Blogging Platform built with the MERN Stack.

---

## 🎯 Project Overview

A powerful, full-stack web application that combines a real-time Markdown editor with a full-featured blogging platform — all in one place.

**The Problem it solves:**
- Writers waste time switching between apps to draft and publish
- Hard to manage many files and folders in one place  
- Many platforms don't show reader analytics (likes, views)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🖊️ **Markdown Editor** | Live editor with real-time preview |
| 📁 **Folder System** | Organize drafts in nested folders |
| 🔐 **JWT Authentication** | Secure login with access + refresh tokens |
| 🌐 **Public Blog Page** | Clean page for readers to browse published posts |
| ❤️ **Like Button** | Readers can like blog posts |
| 📊 **Analytics** | View total post likes and views |
| 🔍 **Search** | Instant search by title, tags, or content |
| 📄 **Draft Saving** | Save blog posts as drafts before publishing |
| 🚨 **Error Boundary** | Graceful error handling — no blank pages |

---

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript (Vite)
- **Tailwind CSS** for styling
- **React Router v7** for navigation
- **React Markdown** for rendering Markdown preview
- **Lucide React** for icons
- **html2pdf.js** for PDF export

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JSON Web Tokens (JWT)** for authentication
- **bcryptjs** for password hashing

---

## 📁 Project Structure

```
Markdown-Editor-Vite/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/         # Login/Register screens
│   │   │   ├── Editor/       # Markdown editor component
│   │   │   ├── FileExplorer/ # File/Folder tree
│   │   │   ├── Preview/      # Markdown preview
│   │   │   ├── Sidebar/      # Dashboard sidebar
│   │   │   └── UI/           # Shared UI components
│   │   ├── contexts/         # React context (Auth)
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API service layer
│   │   └── types/            # TypeScript type definitions
│   └── package.json
│
└── backend/                  # Node.js + Express backend
    ├── controllers/          # Route handlers
    ├── middleware/           # Auth middleware
    ├── models/               # MongoDB models
    ├── routes/               # API routes
    └── server.js             # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/viswavardhan2004/Markdown-Editor-Vite.git
cd Markdown-Editor-Vite
```

### 2. Set Up the Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 3. Set Up the Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env with your backend URL
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`.env`)
```env
MONGODB_URI=mongodb://localhost:27017/markdown-editor
JWT_SECRET=your-secret-key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env`)
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |

### Files & Folders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/files` | Get all files and folders |
| POST | `/api/files/file` | Create a new file |
| POST | `/api/files/folder` | Create a new folder |
| PUT | `/api/files/file/:id` | Update file content |
| DELETE | `/api/files/:id` | Delete file or folder |

### Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs/public` | Get all public blogs |
| GET | `/api/blogs/public/:slug` | Get blog by slug |
| GET | `/api/blogs/search?q=query` | Search blogs |
| POST | `/api/blogs/publish` | Publish a blog |
| POST | `/api/blogs/draft` | Save as draft |
| GET | `/api/blogs` | Get user's blogs |
| PUT | `/api/blogs/:id` | Update blog |
| DELETE | `/api/blogs/:id` | Delete blog |
| GET | `/api/blogs/:id/analytics` | Get blog analytics |
| POST | `/api/blogs/public/:id/track` | Track likes/views |

---

## 🔐 Security Features

- **JWT Access Tokens** (15 min expiry) + **Refresh Tokens** (7 days)
- **bcrypt** password hashing
- **CORS** origin restriction
- **Password validation** (minimum 6 characters)
- Protected routes — only owners can edit their files

---

## 👨‍💻 Author

**Viswa Vardhan**  
Reg No: 12220258  
GitHub: [@viswavardhan2004](https://github.com/viswavardhan2004)

---

## 📜 License

This project is for educational purposes as part of a seminar project.