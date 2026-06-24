# Step 1: Build the Next.js frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Set up the Python backend
FROM python:3.10-slim
WORKDIR /app/backend

# Copy the backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ ./

# Copy the built frontend static files from Step 1
COPY --from=frontend-builder /app/frontend/out /app/frontend/out

# Expose the Hugging Face Spaces port
EXPOSE 7860

# Run FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
