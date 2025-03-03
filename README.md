# DevConnect 🚀

DevConnect – A matchmaking platform for developers! Swipe, match, and collaborate on exciting projects.

🔹 Find like-minded coders, mentors, and open-source contributors  
🔹 Connect based on **skills, experience, and interests**  
🔹 Built with ❤️ using **Node.js, Express, MongoDB**

---

## 📌 Features
✅ **User Authentication** – Secure signup & login  
✅ **Match Developers** – Swipe & connect based on skills  
✅ **Collaboration Requests** – Send and manage connection requests  
✅ **Block Users** – Control interactions with the block feature  
✅ **Real-time Updates** – Get notified about new matches (Upcoming)

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Authentication:** JWT  
- **Real-time Communication:** WebSockets (Upcoming)

---

## 🚀 Installation & Setup

1️⃣ **Clone the repository**  
~~~bash
git clone https://github.com/your-username/dev-connect.git
cd dev-connect
~~~

2️⃣ **Install dependencies**  
~~~bash
npm install
~~~

3️⃣ **Run the server**  
~~~bash
npm start
~~~

👉 **Server runs on:** `http://localhost:3000/`

---

## 🔗 API Endpoints

### 🔹 User APIs
- `POST /signup` – Register a new user  
- `POST /login` – Authenticate user

### 🔹 Matchmaking APIs
- `POST /connect/:toUserId` – Send a connection request  
- `POST /block/:toUserId` – Block a user

### 🔹 Other APIs
- `GET /users/:id` – Fetch user details  
- `GET /users/matches` – View matched developers

---

## 🤝 Contributing

Want to improve DevConnect? 🎉  
1. Fork the repo  
2. Create a feature branch (`git checkout -b feature-xyz`)  
3. Commit your changes (`git commit -m "Added feature XYZ"`)  
4. Push & open a PR!


### 💡 Have a feature idea?
Open an issue or reach out! 🚀
