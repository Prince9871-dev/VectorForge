from fastapi import APIRouter
from models.request_models import RAGAskRequest, DocSearchRequest
from models.response_models import RAGAskResult, DocSearchResult
from services.rag_service import rag_service

router = APIRouter(prefix="/rag", tags=["RAG"])

@router.post("/ask", response_model=RAGAskResult)
async def ask_question(request: RAGAskRequest):
    return await rag_service.ask_question(question=request.question, k=request.k)

@router.post("/search", response_model=DocSearchResult)
async def search_contexts(request: DocSearchRequest):
    return await rag_service.search_documents(question=request.question, k=request.k)
