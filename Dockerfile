# Ensure backend and app are Python packages
RUN touch backend/__init__.py
RUN touch backend/app/__init__.py

# Set working directory to /app
WORKDIR /app

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]