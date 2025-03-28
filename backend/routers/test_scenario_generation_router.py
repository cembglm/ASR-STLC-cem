from fastapi import APIRouter, HTTPException
from stlc.test_scenario_generation import generate_prompt, run_step
from typing import Dict

router = APIRouter(
    prefix="/api/test-scenario-generation",
    tags=["test-scenario-generation"]
)

@router.post("/generate-prompt")
async def generate_test_scenario_prompt(data: Dict):
    """
    Test senaryosu prompt'u oluşturur.
    """
    result = await generate_prompt(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/run")
async def run_test_scenario_generation(data: Dict):
    """
    Test senaryosu üretim işlemini çalıştırır.
    """
    result = await run_step(data)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result