# SwiftChat

📚 About the Project

I built SwiftChat as a personal learning project to deepen my understanding of modern full-stack development. My goal was to explore how real-time applications are built by combining:

Angular's reactive frontend architecture

Flask's lightweight API structure

WebSocket communication with Socket.IO

MySQL relational database design

Having grown up using platforms like Skype, Teamspeak, Microsoft Teams, and Discord, I’ve always wanted to build my own simple yet functional chat app both for the challenge and to better understand the systems behind the tools I use every day.

For fun, I even added some League of Legends-themed icons, since I frequently use chat apps while gaming. In the future, I’d love to integrate voice chat functionality, so I can play and communicate with friends directly in SwiftChat. That would be awesome.

---

## 🚀 Features

- 🔐 User registration & login system
- 💬 Private 1-on-1 real-time messaging
- 📊 Admin dashboard with app analytics (users, conversations, activity)
- 🧍‍♂️ User profile update (password, bio, avatar)
- 🧭 Dynamic user and conversation handling
- 🧠 Angular frontend with RxJS reactive state
- 🔄 Live updates with WebSockets (Socket.IO)
- 💾 MySQL database
- 📦 REST API + WebSocket event-based architecture

---

## 🛠️ Tech Stack
| Layer       | Technology             |
|-------------|------------------------|
| Frontend    | Angular                |
| Backend     | Flask                  |
| Database    | MySQL                  |

---

## ⚙️ Setup Instructions

### 1. Backend (Flask)
#### 🔹 Step 1: Create virtual environnement and activate it

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

#### 🔹 Step 2: Install requirements

```bash
pip install -r requirements.txt
```

#### 🔹 Step 3: run the app

```bash
python app.py
```
Backend runs at: http://127.0.0.1:5000

### 2. Frontend (Angular)

### 🔹 Step 1:  Install Angular CLI (if needed)

```bash
npm install -g @angular/cli
```

#### 🔹 Step 2: Go to frontend folder and install dependecies

```bash
cd client
npm ci 
```

#### 🔹 Step 3: Start Angular dev server
```bash
npm start
```

Frontend runs at: http://localhost:4200


### 🧭 Environment Variables
You can use a .env file or set variables manually to your own mySQL instance:

```bash
MYSQL_HOST=yourhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DB=yourDB
DEBUG=True
```


✅ TODO / Improvements
 - JWT auth
 
 - Improve security (there are a lot of easy ways to get information that should not be avalaible for a bad actor)

 - Add tests

 - Online user status display

 - Notifications for new conversations/messages

 - File & image upload support


🧾 License
This project is licensed under the MIT License.