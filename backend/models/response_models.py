from pydantic import BaseModel
from typing import List, Optional, Any

class VectorItem(BaseModel):
    id: int
    metadata: str
    category: str
    embedding: Optional[List[float]] = None
    distance: Optional[float] = None

class VectorSearchResult(BaseModel):
    results: List[VectorItem]
    latencyUs: int
    algo: str
    metric: str

class InsertResult(BaseModel):
    id: int

class DeleteResult(BaseModel):
    ok: bool

class DocInsertResult(BaseModel):
    ids: List[int]
    chunks: int
    dims: int

class DocContext(BaseModel):
    id: int
    title: str
    text: Optional[str] = None
    distance: float

class DocSearchResult(BaseModel):
    contexts: List[DocContext]

class RAGAskResult(BaseModel):
    answer: str
    model: str
    contexts: List[DocContext]
    docCount: int

class BenchmarkResult(BaseModel):
    bruteforceUs: int
    kdtreeUs: int
    hnswUs: int
    itemCount: int

class SystemStatusResult(BaseModel):
    ollamaAvailable: bool
    embedModel: str
    genModel: str
    docCount: int
    docDims: int
    demoDims: int
    demoCount: int
