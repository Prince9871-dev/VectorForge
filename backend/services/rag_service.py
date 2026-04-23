from services.cpp_client import cpp_client

class RAGService:
    @staticmethod
    async def ask_question(question: str, k: int):
        return await cpp_client.ask_rag(question, k)

    @staticmethod
    async def search_documents(question: str, k: int):
        return await cpp_client.search_docs(question, k)

rag_service = RAGService()
