# Medical Chatbot

An end-to-end AI-powered medical chatbot with voice, vision, and document retrieval capabilities.

<img src="https://github.com/sharmamanishcomp/medical-chatbot/blob/main/ai-chatbot.png" alt="AI Chatbot" />

## Features

- **Speech-to-Text**: Ask questions using your voice.
- **Image Upload**: Upload medical images for analysis.
- **Document Retrieval**: Answers are grounded in your uploaded PDF documents.
- **Doctor's Response**: AI provides context-aware medical answers.
- **Add New PDFs**: Easily add new medical PDFs to the knowledge base.

## Project Structure

- `main.py` - FastAPI backend with LangChain, Groq LLM, and vector DB.
- `helpers/helper_classes.py` - Utilities for loading, splitting, and embedding documents.
- `frontend/` - React frontend with voice and image input.

## Setup Instructions

### 1. Backend

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

- Set environment variables in a `.env` file (see `.env.example` if present).
- Start the backend:
```bash
uvicorn main:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Add PDFs to Vector DB

Send a POST request to `/add-pdf` with a PDF file:
```bash
curl -F "file=@yourfile.pdf" http://localhost:8000/add-pdf
```

## API Endpoints

- `POST /chat`  
  Request:  
  ```json
  {
    "question": "What is diabetes?",
    "image": "<base64-encoded-image>"
  }
  ```
  Response:  
  ```json
  {
    "answer": "..."
  }
  ```

## Notes

- Make sure your backend and frontend origins are set correctly for CORS.
- Only use trusted PDFs for ingestion.

## License

MIT


