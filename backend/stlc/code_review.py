from fastapi import APIRouter, UploadFile, File, HTTPException
from services.review_service import ReviewService
import logging

router = APIRouter()
logger = logging.getLogger("code_review")
review_service = ReviewService()

@router.post("/run")
async def process_code_review(files: list[UploadFile] = File(...)):
    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded.")
        
        results = await review_service.run_code_review(files)
        return results
    except Exception as e:
        logger.error(f"Code Review Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
