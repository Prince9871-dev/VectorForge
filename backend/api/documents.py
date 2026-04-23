from fastapi import APIRouter
from models.request_models import DocInsertRequest
from models.response_models import DocInsertResult, DeleteResult
from services.cpp_client import cpp_client

router = APIRouter(prefix="/docs", tags=["Documents"])

@router.post("/upload", response_model=DocInsertResult)
async def upload_document(request: DocInsertRequest):
    return await cpp_client.insert_doc(title=request.title, text=request.text)

@router.get("/list")
async def list_documents():
    return await cpp_client.get_docs()

@router.delete("/{doc_id}", response_model=DeleteResult)
async def delete_document(doc_id: int):
    return await cpp_client.delete_doc(doc_id)
