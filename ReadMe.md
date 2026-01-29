# **Band Length Calculator — Full Stack App**  
FastAPI Backend + React (Vite) Frontend

This project is a complete full‑stack application for calculating slingshot band lengths, storing results, filtering historical calculations, and visualizing **Active Length vs Thickness** with a dynamic chart.

It includes:

- **FastAPI backend** (SQLite + SQLAlchemy)
- **React frontend** (Vite)
- **REST API** for calculations, filtering, and chart generation
- **Database persistence**
- **Interactive UI** for calculations, filtering, and chart display
- **Docker Compose** for running everything together

---

# **📦 Requirements**

### **Backend**
- Python 3.10+
- pip

### **Frontend**
- Node.js 18+
- npm or yarn

### **Docker (optional)**
- Docker Engine
- Docker Compose v2+

---

# **📁 Project Structure**

```
backend/
  app/
    main.py
    db.py
    models.py
  requirements.txt
  Dockerfile

frontend/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    App.css
    api.js
    components/
      BandForm.jsx
      RecordsTable.jsx
      FilterForm.jsx
      ChartView.jsx

docker-compose.yml
```

---

# **🚀 Backend Setup (FastAPI)**

### **1. Navigate to backend folder**

```bash
cd backend
```

### **2. Install dependencies**

```bash
pip install -r requirements.txt
```

### **3. Start the FastAPI server**

```bash
uvicorn app.main:app --reload
```

### **4. Backend will be available at:**

- API root: **http://localhost:8000**
- Swagger docs: **http://localhost:8000/docs**
- Chart endpoint: **http://localhost:8000/chart/active-vs-thickness**

---

# **🖥️ Frontend Setup (React + Vite)**

### **1. Navigate to frontend folder**

```bash
cd frontend
```

### **2. Install dependencies**

```bash
npm install
```

### **3. Start the React dev server**

```bash
npm run dev
```

### **4. Frontend will be available at:**

- **http://localhost:5173**

The frontend is already configured to communicate with the backend at `http://localhost:8000`.

---

# **🔗 How the Services Communicate**

The frontend (React) and backend (FastAPI) communicate over HTTP using a shared Docker network or localhost during development.

### **When running locally (without Docker):**

- Frontend runs at:  
  **http://localhost:5173**
- Backend runs at:  
  **http://localhost:8000**

The frontend makes API calls directly to:

```
http://localhost:8000/calculate
http://localhost:8000/records
http://localhost:8000/filter
http://localhost:8000/chart/active-vs-thickness
```

CORS is enabled in FastAPI to allow requests from the React dev server.

---

### **When running with Docker Compose:**

Both services run inside the same Docker network (`bandnet`):

- Backend container name: **backend**
- Frontend container name: **frontend**

Inside Docker, services can reach each other by name:

```
http://backend:8000
```

However, the **browser** still accesses the backend through the host machine:

```
http://localhost:8000
```

This is why the frontend continues to call `http://localhost:8000` even when containerized.

---

# **🐳 Running Everything with Docker Compose**

From the project root:

```bash
docker-compose up --build
```

Then open:

- **Frontend:** http://localhost:5173  
- **Backend API:** http://localhost:8000  
- **Swagger Docs:** http://localhost:8000/docs  

Both services hot‑reload thanks to volume mounts.

---

# **🧪 Testing the API**

### Example request:

```bash
curl -X POST http://localhost:8000/calculate \
  -H "Content-Type: application/json" \
  -d '{"fltDrawLengthCM":80,"fltElongationCM":5,"brand":"GZK","thickness":0.7}'
```

---

# **📌 Notes**

- SQLite database file (`banddata.db`) is created automatically on first run.
- CORS is enabled for the React dev server.
- The backend is API‑only; all UI is handled by React.
- Docker Compose handles networking automatically.
