from fastapi import APIRouter
from models.request_models import BenchmarkRequest
from models.response_models import BenchmarkResult
from services.benchmark_service import benchmark_service

router = APIRouter(prefix="/benchmark", tags=["Benchmark"])

@router.post("/run", response_model=BenchmarkResult)
async def run_benchmark(request: BenchmarkRequest):
    return await benchmark_service.run_algorithm_comparison(
        vector=request.vector,
        k=request.k,
        metric=request.metric
    )
