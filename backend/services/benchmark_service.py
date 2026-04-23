from services.cpp_client import cpp_client

class BenchmarkService:
    @staticmethod
    async def run_algorithm_comparison(vector: list, k: int, metric: str):
        return await cpp_client.run_benchmark(vector, k, metric)

benchmark_service = BenchmarkService()
