# 🚀 ResolveHub – Online Dispute Resolution Platform

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Backend-SpringBoot-green?style=for-the-badge&logo=springboot)
![Java](https://img.shields.io/badge/Language-Java-orange?style=for-the-badge&logo=java)
![H2](https://img.shields.io/badge/Database-H2-lightgrey?style=for-the-badge&logo=databricks)
![Status](https://img.shields.io/badge/Project-Production--Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## ⚖️ Overview

**ResolveHub** is a full-stack **Online Dispute Resolution (ODR)** platform that digitizes traditional conflict resolution.

It enables:
- Users to file disputes
- Upload evidence (optional)
- Communicate with mediators
- Track case progress
- Resolve disputes efficiently

Built as a **modern legal-tech platform** with real-world usability.

---

## ✨ Key Features

### 👤 User Features
- 📝 File disputes with structured inputs
- 📂 Optional evidence upload
- 📊 Live dashboard with analytics
- 💬 Secure messaging with admin
- 🔍 Smart dispute search
- 🔔 Notifications

### 🧑‍⚖️ Admin / Mediator Features
- ⚖️ Review all disputes
- 🔄 Update status:
  - Filed
  - Under Review
  - In Mediation
  - Resolved / Rejected
- 💬 Message any user
- 📅 Schedule resolution dates
- 📊 Monitor system analytics

---

## 🧠 System Architecture



Frontend (React + Vite)
↓
REST API (Spring Boot)
↓
H2 Database (In-Memory)


---

## 🛠️ Tech Stack

### 🎨 Frontend
- React.js (Vite)
- Axios (API communication)
- Lucide Icons
- Custom CSS (Glassmorphism UI)

### ⚙️ Backend
- Java Spring Boot
- REST APIs
- JPA / Hibernate

### 🗄️ Database
- H2 Database (No setup required)

---


---

## 🏗️ Architecture Diagram

```mermaid
flowchart TD

A[User / Admin Browser] --> B[React Frontend (Vite)]
B -->|HTTP Requests| C[Spring Boot Backend]

C --> D[Dispute APIs]
C --> E[Auth APIs]
C --> F[File Upload APIs]

D --> G[(H2 Database)]
E --> G
F --> G

subgraph Frontend_Features
    B1[Dashboard]
    B2[File Dispute]
    B3[Messaging - LocalStorage]
    B4[Calendar - LocalStorage]
    B5[Search & Notifications]
end

B --> B1
B --> B2
B --> B3
B --> B4
B --> B5

subgraph Backend_Modules
    C1[Controllers]
    C2[Services]
    C3[Repositories]
end

C --> C1
C1 --> C2
C2 --> C3
C3 --> G
---

## ▶️ Run Locally

### 🔹 1. Backend

```bash
cd backend
mvn spring-boot:run

Runs on:
👉 http://localhost:8080

🔹 2. Frontend
cd frontend
npm install
npm run dev

Runs on:
👉 http://localhost:5173

🔐 Authentication Flow
User registers → stored in backend + localStorage
Login → session stored locally
Role-based UI:
USER → can file disputes
ADMIN → can resolve/manage

💬 Messaging System
Admin ↔ User communication
Admin can message any user
User can only message admin
Stored in localStorage (demo-level persistence)

📅 Calendar System
Admin schedules resolution dates
Users can view scheduled cases
Stored locally (demo feature)

📊 Dashboard Features
Total disputes
Resolved cases
In-progress cases
Mediation count
Live animated graph

📌 Important Notes
✔️ File upload is optional
✔️ Messaging & calendar use localStorage
✔️ Disputes stored in backend DB
✔️ No MySQL setup required (uses H2)

🚀 Future Enhancements
🔥 WebSocket real-time chat
☁️ Cloud file storage (AWS S3)
🤖 AI dispute resolution suggestions
🌐 Multi-language support
🔐 JWT authentication
📱 Mobile app version


🧪 Demo Use Case
1.Register as User
2.File dispute
3.Login as Admin
4.Review + resolve case
5.Schedule resolution
6.Chat between admin & user

---

👨‍💻 Author

Rohan Ramgopal
