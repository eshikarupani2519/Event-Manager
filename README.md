# Event Management Platform 🎉

This project is a full-stack **Event Management Platform** built during **Elite Hacks**.  
It allows users to create events, register attendees, manage check-ins, and provide AI-based event recommendations.

---

## 🚀 Tech Stack

### Frontend
- Angular

### Backend
- Node.js
- Express.js

### Database
- MySQL

### AI / ML Service
- Python
- Flask

---

## 📌 Features
- Event creation and management
- Event registration system
- Attendee check-in
- Razorpay payment integration
- AI-powered event recommendations
- Engagement tracking

---

## ⚙️ Environment Setup

Before running the project, create a `.env` file in the backend and add the following variables:

```
PORT=your_port_number

EMAIL=your_email_id
EMAIL_PASS=your_emial_passsword

RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
OPENAI_API_KEY=your_open_api_key

```

You must:
- Create your **own MySQL database**
- Add your **Razorpay API keys**
- Configure the **port number**

---

Before running the project, create a `.env` file in the MLRecommendations and add the following variables:
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=eventManagementSystem



# ▶️ How to Run the Project

You need to run **three services**: Backend, Frontend, and ML Recommendation Service.

---

## 1️⃣ Start Backend Server

Open a terminal:

```bash
cd backend
npm install
node server.js
```

---

## 2️⃣ Start Frontend (Angular)

Open another terminal:

```bash
npm install
ng serve
```

The Angular app will start on:

```
http://localhost:4200
```

---

## 3️⃣ Start ML Recommendation Service

Open a third terminal:

```bash
cd MLRecommendations
py ml_service.py
```

This will start the **Python Flask AI recommendation service**.

---

## 📂 Project Structure

```
Event-Manager
│
├── backend
│   └── Node.js + Express API
│
├── frontend
│   └── Angular Application
│
├── ml-recommendations
│   └── Python Flask AI Service
│
└── README.md
```

---

## 👨‍💻 Developed For

**Elite Hacks Hackathon**

---

## ⭐ Future Improvements
- Advanced AI recommendation models
- Real-time analytics dashboard
- Improved UI/UX
- Notification system
