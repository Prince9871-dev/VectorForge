import httpx
from core.config import settings
from fastapi import HTTPException

class CppEngineClient:
    def __init__(self):
        self.base_url = settings.CPP_ENGINE_URL

    async def _get(self, path: str, params: dict = None):
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.base_url}{path}", params=params)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise HTTPException(status_code=502, detail=f"C++ Engine Error: {str(e)}")

    async def _post(self, path: str, json: dict = None):
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(f"{self.base_url}{path}", json=json)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise HTTPException(status_code=502, detail=f"C++ Engine Error: {str(e)}")

    async def _delete(self, path: str):
        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(f"{self.base_url}{path}")
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                raise HTTPException(status_code=502, detail=f"C++ Engine Error: {str(e)}")

    # Vector Search API
    async def vector_search(self, vector: list, k: int, metric: str, algo: str):
        v_str = ",".join(map(str, vector))
        return await self._get("/search", params={"v": v_str, "k": k, "metric": metric, "algo": algo})

    async def insert_vector(self, metadata: str, category: str, embedding: list):
        return await self._post("/insert", json={"metadata": metadata, "category": category, "embedding": embedding})

    async def delete_vector(self, vector_id: int):
        return await self._delete(f"/delete/{vector_id}")

    async def get_items(self):
        return await self._get("/items")

    # Document / RAG API
    async def insert_doc(self, title: str, text: str):
        return await self._post("/doc/insert", json={"title": title, "text": text})

    async def delete_doc(self, doc_id: int):
        return await self._delete(f"/doc/delete/{doc_id}")

    async def get_docs(self):
        return await self._get("/doc/list")

    async def search_docs(self, question: str, k: int):
        return await self._post("/doc/search", json={"question": question, "k": k})

    async def ask_rag(self, question: str, k: int):
        return await self._post("/doc/ask", json={"question": question, "k": k})

    # Benchmark & Status
    async def run_benchmark(self, vector: list, k: int, metric: str):
        v_str = ",".join(map(str, vector))
        return await self._get("/benchmark", params={"v": v_str, "k": k, "metric": metric})

    async def get_status(self):
        return await self._get("/status")

cpp_client = CppEngineClient()
