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

# Copy backend code directly into /app
COPY backend .

# Copy frontend build into backend static directory
RUN mkdir -p static
COPY --from=frontend /app/frontend/dist ./static

# Ensure backend is a Python package (optional)
RUN touch __init__.py

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]