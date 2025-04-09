from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from services.review_service import ReviewService
import logging
from typing import Optional

router = APIRouter()
logger = logging.getLogger("code_review")
review_service = ReviewService()

@router.post("/run")
async def process_code_review(
    files: list[UploadFile] = File(...),
    model: Optional[str] = Form(None)
):
    try:
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded.")
        
        logger.info(f"Code review requested with model: {model}")
        results = await review_service.run_code_review(files, model)
        return results
    except Exception as e:
        logger.error(f"Code Review Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
