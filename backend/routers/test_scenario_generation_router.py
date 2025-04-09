from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from stlc.test_scenario_generation import generate_prompt, run_step
from typing import Dict
from core.database import get_database

router = APIRouter(
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

@router.get("/")
async def read_test_scenarios():
    try:
        db = await get_database()
        # Add your test scenario logic here
        return {"message": "Test scenarios endpoint"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test-type/{test_type}")
async def get_test_type_details(test_type: str):
    """
    Fetch complete test type details including prompt and scoring elements.
    """
    try:
        print(f"Fetching details for test type: {test_type}")
        db = await get_database()
        test_collection = db["test_type"]
        
        # Find document matching the test type
        doc = await test_collection.find_one({"test_name": test_type})
        print(f"Found document: {doc}")
        
        if not doc:
            print(f"No document found for test type: {test_type}")
            raise HTTPException(status_code=404, detail=f"No details found for test type: {test_type}")
            
        response_data = {
            "test_prompt": doc.get("test_prompt", ""),
            "test_scoring_elements_and_prompts": doc.get("test_scoring_elements_and_prompts", {}),
            "test_instruction_elements_and_prompts": doc.get("test_instruction_elements_and_prompts", {})
        }
        print(f"Returning response: {response_data}")
        return response_data
    except Exception as e:
        print(f"Error in get_test_type_details: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))