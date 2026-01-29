# Build frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Build backend
FROM python:3.12-slim AS backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend ./backend

# Copy frontend build into backend static directory
RUN mkdir -p backend/static
COPY --from=frontend /app/frontend/dist ./backend/static

# Ensure backend is a Python package
RUN touch backend/__init__.py

# Set working directory to backend
WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]