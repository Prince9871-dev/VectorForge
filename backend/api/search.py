from fastapi import APIRouter
from models.request_models import VectorSearchRequest, VectorInsertRequest
from models.response_models import VectorSearchResult, InsertResult, DeleteResult
from services.cpp_client import cpp_client

router = APIRouter(prefix="/search", tags=["Vector Search"])

@router.post("/query", response_model=VectorSearchResult)
async def search_vectors(request: VectorSearchRequest):
    return await cpp_client.vector_search(
        vector=request.vector,
        k=request.k,
        metric=request.metric,
        algo=request.algo
    )

@router.post("/insert", response_model=InsertResult)
async def insert_vector(request: VectorInsertRequest):
    return await cpp_client.insert_vector(
        metadata=request.metadata,
        category=request.category,
        embedding=request.embedding
    )

@router.delete("/{vector_id}", response_model=DeleteResult)
async def delete_vector(vector_id: int):
    return await cpp_client.delete_vector(vector_id)

@router.get("/items")
async def list_vectors():
    return await cpp_client.get_items()
