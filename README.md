# Github User Search

A React + TypeScript app to search Github users and view their public repositories. Built using Material UI (MUI) for a clean UI and `fetch` API for data handling.

## 🔍 Features

- Search Github users by username
- View avatar and username
- Expand user to see their public repositories
- Shows repo name, description, and star count
- Responsive and minimal UI using MUI

## 🛠 Tech Stack

- React
- TypeScript
- Material UI (MUI)
- Github REST API
- Custom `useFetch` hook

## 📁 Project Structure

src/
├── App.tsx # Root app entry point
├── pages/
│ └── UserSearch.tsx # Main page (search + results)
├── components/
│ └── UserItem.tsx # Reusable user accordion component
├── hooks/
│ └── useFetch.ts # Reusable fetch hook
├── types/
│ └── Github.ts # TypeScript types for Github API
└── App.css # Global styles

## ▶️ Getting Started

### 1. Clone the Repo

git clone https://Github.com/your-username/Github-user-search.git
cd Github-user-search

### 2. Install Dependencies

npm install

### 3. Run the App

npm run dev

The app will open at http://localhost:5173 (or similar, if using Vite).

## 🔐 Note on API Usage

This app uses Github's public API which has rate limits. If you're unauthenticated, the default limit is 60 requests/hour per IP.

## 📸 Screenshot

Add a screenshot here

---

## 📄 License

MIT
