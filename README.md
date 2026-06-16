# 🚀 Free API Key Management & AI Assistant Platform

A modern web application for generating and managing API keys with an integrated AI-powered assistant. The project combines a clean frontend with a FastAPI backend to provide a simple developer experience for creating, storing, and using API credentials.

---

## ✨ Features

- 🔑 Generate unique API keys for developers
- 💾 Store generated keys in server
- 📋 One-click copy to clipboard
- 🗑️ Delete API keys from both storage and backend
- 🤖 Built-in AI chat assistant for technical questions
- 🎨 Modern responsive user interface
- ⚡ FastAPI-powered backend services
- 🌐 REST API endpoints for integration
- 🔒 Simple and lightweight architecture
- 📱 Works in modern desktop and mobile browsers

---

## 📁 Project Structure

```
project/
│
├── index.html        # Main web interface
├── styles.css        # User interface styling
├── script.js         # Frontend logic
├── main.py           # FastAPI backend
├── test.html         # API testing page
├── app.zip           # compressed project files
└── README.md         # Documentation
```

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- FastAPI
- Python
- Storage API
- REST API
- AI Integration
- Font Awesome

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hacker1514/api.git
cd api
```

### 2. Install Python dependencies

```bash
pip install fastapi uvicorn
```

### 3. Start the backend server

```bash
uvicorn main:app --reload
```

### 4. Open the frontend

Simply open `index.html` in your browser or serve it using:

```bash
python -m http.server 1514
```

Then visit:

```
http://localhost:1514
```

---

## 🔑 API Workflow

1. Enter a developer name or customs name.
2. Click **Generate API Key**.
3. Receive a unique API key.
4. Copy and use the key in your applications.
5. View previously generated keys.
6. Delete keys when no longer needed.

---

## 🤖 AI Assistant

The integrated AI assistant can help with:

- Programming questions
- Debugging guidance
- API usage
- General software development concepts
- Learning resources and explanations

---

## 📡 Example API Usage

### Generate API Key

```http
POST /api/create
```

Example request:

```json
{
  "username": "developer123"
}
```

---

### Save Data

```http
POST /api/{api_key}
```

Example:

```json
{
  "text": "Hello Hacker !"
}
```

---

### Retrieve Data

```http
GET /api/{api_key}
```

---

## 🎯 Use Cases

- Learning FastAPI
- API authentication demos
- Student projects
- Developer tools
- Browser-based key management
- AI-assisted coding interfaces
- Personal experiments and prototypes

---

## 🔒 Security Notice

This project is intended for educational and development purposes. Before deploying in production, consider implementing:

- Authentication and authorization
- HTTPS
- Rate limiting
- Secure secret management
- Encrypted data storage
- Input validation
- Logging and monitoring

---

## 🌟 Future Enhancements

- User accounts
- Database-backed storage
- API usage analytics
- Token expiration
- Role-based permissions
- Dark/light themes
- Multi-device synchronization
- Enhanced AI capabilities

---

## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository, open issues, and submit pull requests to improve the project.

---

## 📄 License

This project is available under the MIT License.

---

## 👨‍💻 Author

**Niranjan Kumar K**

Passionate about building developer tools, web technologies, and AI-powered applications.
Father of K programming and kni os (still not published).

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub to support future development.
Email : hackerenvironment1514@gmail.com
Phone : +919515888385
