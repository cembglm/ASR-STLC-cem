"""
pipeline_executor.py
--------------------
determine_pipeline fonksiyonundan gelen adım listesini sırasıyla çalıştırır.
Her adımın giriş-çıkış verilerini yönetir ve son toplu çıktıyı oluşturur.
"""

from stlc import (
    code_review, requirement_analysis, test_planning, test_scenario_generation,
    test_scenario_optimization, test_case_generation, test_case_optimization,
    test_code_generation, environment_setup, test_execution, test_reporting, test_closure
)
from pipeline.pipeline_controller import determine_pipeline

# STLC adımlarına erişmek için basit bir harita oluşturuyoruz
STLC_MODULE_MAP = {
    "codeReview": code_review,
    "requirementAnalysis": requirement_analysis,
    "testPlanning": test_planning,
    "testScenarioGeneration": test_scenario_generation,
    "testScenarioOptimization": test_scenario_optimization,
    "testCaseGeneration": test_case_generation,
    "testCaseOptimization": test_case_optimization,
    "testCodeGeneration": test_code_generation,
    "environmentSetup": environment_setup,
    "testExecution": test_execution,
    "testReporting": test_reporting,
    "testClosure": test_closure
}

def run_pipeline(steps_selected, input_data=None):
    pipeline_steps = determine_pipeline(steps_selected)
    results = {}
    for step in pipeline_steps:
        module = STLC_MODULE_MAP.get(step)
        if not module:
            results[step] = {"error": f"Unknown step '{step}'"}
            continue
        # Her modülde run_step fonksiyonunun olduğunu varsayıyoruz
        step_result = module.run_step(input_data)
        results[step] = step_result
        # Gerekirse step_result, bir sonraki adımın input_data'sı olabilir
    return results
