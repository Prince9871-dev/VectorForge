from pydantic import BaseModel, Field
from typing import List, Optional

class VectorSearchRequest(BaseModel):
    vector: List[float] = Field(..., description="Query vector")
    k: int = Field(5, description="Number of results to return")
    metric: str = Field("cosine", description="Distance metric: cosine, euclidean, or manhattan")
    algo: str = Field("hnsw", description="Search algorithm: hnsw, kdtree, or bruteforce")

class VectorInsertRequest(BaseModel):
    metadata: str = Field(..., description="Metadata string")
    category: str = Field(..., description="Category for filtering")
    embedding: List[float] = Field(..., description="Embedding vector")

class DocInsertRequest(BaseModel):
    title: str = Field(..., description="Document title")
    text: str = Field(..., description="Document content text")

class DocSearchRequest(BaseModel):
    question: str = Field(..., description="Question or search query")
    k: int = Field(3, description="Number of context chunks to retrieve")

class RAGAskRequest(BaseModel):
    question: str = Field(..., description="Question to ask the AI")
    k: int = Field(3, description="Number of context chunks to retrieve")

class BenchmarkRequest(BaseModel):
    vector: List[float] = Field(..., description="Query vector")
    k: int = Field(5, description="Number of results")
    metric: str = Field("cosine", description="Distance metric")
