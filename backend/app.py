import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from stlc.code_review import router as code_review_router
from routers.test_scenario_generation_router import router as test_scenario_router
from stlc.test_scenario_generation import generate_prompt
import logging

# from stlc.requirement_analysis import router as requirement_analysis_router
# from stlc.test_planning import router as test_planning_router

app = FastAPI(
    title="STLC Manager Backend",
    description="STLC Manager Backend API",
    version="0.1.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router ekleme
app.include_router(code_review_router, prefix="/api/processes/code-review")
app.include_router(test_scenario_router, prefix="/api/processes/test-scenario-generation")
# app.include_router(requirement_analysis_router, prefix="/api/processes/requirement-analysis")
# app.include_router(test_planning_router, prefix="/api/processes/test-planning")

@app.get("/")
def read_root():
    return {"message": "STLC Manager Backend is running!"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
