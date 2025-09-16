
# 📂 **TalentFlow**

A mini hiring platform built with **React + TypeScript**, using **Vite**, **MirageJS**, and **Dexie** for API mocking and local persistence. This project simulates job management, candidate tracking, assessments, and timelines — all without a backend.

---

## ✅ **Features**

* Job listing, creation, and editing
* Candidate profiles and timelines
* Assessment creation and submission
* Offline-first with IndexedDB (using Dexie)
* API mocking with MirageJS
* Fully responsive UI

---

## 📁 **Project Structure**

```
talentflow/
├── api/                    # API-related mocks or utilities
├── public/                 # Static assets like images
├── src/                    # Source files
│   ├── assets/             # Images and icons
│   ├── components/         # Reusable UI components
│   ├── mirage/             # Mock server, local persistence and seed data
│   ├── pages/              # Application pages/screens
│   ├── App.tsx             # Main component
│   ├── main.tsx            # App entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # TypeScript environment declarations
├── dist/                   # Compiled output
├── index.html              # Main HTML file
├── package.json            # Project dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## 📦 **Technologies Used**

* **React 18 + TypeScript** – Modern, strongly typed UI framework
* **Vite** – Fast and optimized build tool
* **MirageJS** – Mock API server for development
* **Dexie.js** – IndexedDB wrapper for offline data persistence
* **CSS Modules** – Scoped styling for components and pages
* **ESLint** – Code linting for consistency and best practices

---

## 🚀 **Getting Started**

### Prerequisites

* Node.js (v16 or later recommended)
* npm or pnpm



### Run the Development Server

```bash
cd talentflow
chmod +x run.sh
./run.sh
```

The app will be available at `http://localhost:3000`.


---

## 📂 **Important Files**

* `src/mirage/server.ts`: Defines the mock API routes and handlers
* `src/mirage/dexie.ts`: Manages local persistence with IndexedDB
* `src/pages/`: Contains all the page components like Jobs, Candidates, and Assessments
* `src/components/Dashboard.tsx`: Dashboard layout and navigation
* `src/assets/`: Contains static files like images

---

## 📖 **How It Works**

1. **Mock APIs**
   MirageJS intercepts network requests and provides in-memory API responses.

2. **Offline Data**
   Dexie.js stores data locally in IndexedDB, ensuring persistence across reloads.

3. **TypeScript**
   Strong typing helps with code correctness and better developer experience.

---

## 🤝 **Contributing**

Feel free to fork the repository and submit pull requests. Contributions for UI improvements, bug fixes, and new features are welcome.

---

## 📜 **License**

This project is licensed under the MIT License.

---
