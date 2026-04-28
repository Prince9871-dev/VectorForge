# VectorForge


---

## 📸 Screenshots

### 🖥️ Dashboard
![Dashboard](https://github.com/Prince9871-dev/VectorForge/blob/main/dashboard.jpeg?raw=true)

### 🤖 RAG Interface
![RAG](https://github.com/Prince9871-dev/VectorForge/blob/main/rag.jpeg?raw=true)

### 🔍 Search & Results
![Search](https://github.com/Prince9871-dev/VectorForge/blob/main/search.jpeg?raw=true)

### 🏗️ Architecture Flow
![Architecture](https://github.com/Prince9871-dev/VectorForge/blob/main/architecture.jpeg?raw=true)

### ⚙️ Additional View
![Extra](https://github.com/Prince9871-dev/VectorForge/blob/main/extra.jpeg?raw=true)

VectorForge
Production-grade semantic vector search infrastructure built with C++, FastAPI, React, and local LLM inference via Ollama.
VectorForge is a high-performance AI systems project that demonstrates how modern vector databases like Pinecone, Weaviate, Chroma, and Milvus work internally — built from scratch using a custom C++ vector engine and a scalable full-stack architecture.
It combines:


Custom C++ vector search engine


HNSW + KD-Tree + Brute Force search


FastAPI backend service layer


React + Vite frontend dashboard


Real-time semantic vector visualization


Local RAG pipeline using Ollama


Benchmark comparison between search algorithms


Production-grade modular architecture


This is a complete semantic search and retrieval system built for real-world understanding of vector databases and AI infrastructure.

Why This Project Exists
Traditional databases rely on exact keyword matching.
Modern AI systems require semantic understanding.
Instead of searching for:
find documents containing "binary tree"
we need systems that understand related meaning like:
tree traversal, recursion, graph traversal
even if the exact words are different.
This requires:


vector embeddings


nearest neighbor search


similarity ranking


retrieval-augmented generation (RAG)


VectorForge solves exactly that.

System Architecture
React Frontend      ↓FastAPI Backend      ↓C++ Vector Engine      ↓Ollama + Local LLM      ↓Semantic Search + RAG Response

Core Features
High-Performance C++ Vector Engine
Built from scratch using:


HNSW (Hierarchical Navigable Small World)


KD-Tree


Brute Force Search


Supports:


Cosine Similarity


Euclidean Distance


Manhattan Distance


Real vector indexing and nearest-neighbor search without relying on external vector database services.

FastAPI Backend Service
Structured Python service layer with:


API gateway for frontend communication


Request validation


Modular routes


Async endpoints


Benchmark endpoints


Document management


RAG endpoints


Analytics endpoints


Designed for clean production architecture.

React Frontend Dashboard
Modern UI built with:


Semantic vector visualization


Glowing vector node canvas


Search comparison dashboard


Benchmark graphs


Document insertion system


Ask AI (RAG interface)


Algorithm comparison panel


Premium monochrome dashboard design



Local RAG Pipeline
Uses:


nomic-embed-text → Embedding model


llama3.2 → Generation model


Flow:
Question→ Embedding→ HNSW Retrieval→ Context Ranking→ Local LLM Generation→ Final Grounded Answer
Fully local inference without cloud API dependency.

How VectorForge Works
User Query    ↓Embedding Generation    ↓Vector Search(HNSW / KD-Tree / Brute Force)    ↓Similarity Ranking    ↓RAG Context Retrieval    ↓Local LLM Response (Ollama)    ↓Final Answer + Visualization
This enables:


semantic understanding


document retrieval


grounded AI responses


algorithm benchmarking


inside one unified system.

Tech Stack
Backend


C++


FastAPI


Python 3.11+


Uvicorn


Pydantic


HTTPX


Frontend


React


Vite


Tailwind CSS


Recharts


Framer Motion


Axios


AI / ML


Ollama


llama3.2


nomic-embed-text


DevOps


Git


GitHub


Render


Vercel



Project Structure
VectorForge/│├── frontend/              # React + Vite frontend│├── backend/               # FastAPI backend service│   ├── app/│   ├── services/│   ├── api/│   └── core/│├── cpp-engine/            # C++ vector engine│   ├── main.cpp│   ├── httplib.h│   └── db.exe│├── README.md└── .gitignore

Local Setup Guide (Windows)
Step 1 — Install Prerequisites
Install:


Git


Python 3.11+


Node.js


MSYS2 + g++


Ollama



Step 2 — Clone Repository
git clone https://github.com/Prince9871-dev/VectorForge.gitcd VectorForge

Step 3 — Install Ollama Models
ollama pull nomic-embed-textollama pull llama3.2
Verify:
ollama list

Step 4 — Run C++ Engine
cd cpp-engineg++ -std=c++17 -O2 main.cpp -o db -lws2_32.\db.exe
Expected:
=== VectorForge Engine ===http://localhost:8080Ollama: ONLINE

Step 5 — Run FastAPI Backend
cd backendpython -m venv venv.\venv\Scripts\activatepip install -r requirements.txtpython -m uvicorn app.main:app --reload
Swagger:
http://127.0.0.1:8000/docs

Step 6 — Run React Frontend
cd frontendnpm installnpm run dev
Frontend:
http://localhost:5173

Final Running Architecture
Frontend → localhost:5173Backend → localhost:8000C++ Engine → localhost:8080Ollama → localhost:11434

API Highlights
Search
GET /api/v1/search/items
Runs semantic vector search.

Insert Documents
POST /api/v1/docs/insert
Embeds and stores real documents.

Ask AI (RAG)
POST /api/v1/rag/ask
Retrieves context and generates grounded answers.

Benchmark
GET /api/v1/benchmark/compare
Compares:


HNSW


KD-Tree


Brute Force


with real latency analysis.

Deployment
Frontend
Deploy using:


Vercel


Backend
Deploy using:


Render


Code Hosting
GitHub Repository:
https://github.com/Prince9871-dev/VectorForge

Note About Ollama
Ollama runs locally for development and demo purposes.
For cloud production, recommended upgrade paths include:


OpenAI API


GPU cloud inference


For learning, development, and project demonstration, local Ollama is sufficient.

Future Improvements
Planned upgrades:


Docker deployment


File upload ingestion


PDF / DOC parser


Vector persistence layer


Authentication system


Cloud inference support


Multi-user workspace


Kubernetes deployment



Author
Prince Jha
Focused on:


AI Infrastructure


Backend Engineering


Distributed Systems


Vector Databases


Production Systems


