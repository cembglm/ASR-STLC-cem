"""
test_scenario_generation.py
---------------------------
STLC'nin Test Scenario Generation adımına ait işlemleri yönetir.
"""

import logging
from utils.model_client import get_llm_instance
from core.prompt_manager import get_prompts_for_step
from utils.validation import validate_output_format

logger = logging.getLogger(__name__)

async def generate_prompt(input_data):
    try:
        # Form verilerini al
        test_type = input_data.get("test_type", "")
        test_category = input_data.get("test_category", "")
        scoring_elements = input_data.get("scoringElements", {})
        instruction_elements = input_data.get("instructionElements", {})

        # Prompt şablonunu al
        prompts = get_prompts_for_step("test_scenario_generation")
        base_prompt = prompts.get("scenario_generation_prompt", 
            "Generate test scenarios for {test_type} testing under {test_category} category.")

        # Scoring ve instruction elementleri için ek talimatlar oluştur
        full_prompt = f"""
Test Scenario Generation Requirements:
Category: {test_category}
Type: {test_type}

Scoring Elements:
{chr(10).join(f"- {key}" for key, value in scoring_elements.items() if value)}

Testing Instructions:
{chr(10).join(f"- {key}" for key, value in instruction_elements.items() if value)}

Please generate test scenarios following these guidelines and requirements.
Output should be in JSON format with the following structure:
{{
    "scenarios": [
        {{
            "id": "TS-001",
            "title": "Test Scenario Title",
            "description": "Detailed description of the scenario",
            "prerequisites": ["List of prerequisites"],
            "steps": ["Step 1", "Step 2", "..."]
        }}
    ]
}}
"""
        return {"status": "success", "prompt": full_prompt}

    except Exception as e:
        logger.error(f"Prompt generation error: {str(e)}")
        return {"status": "error", "message": str(e)}

async def run_step(input_data):
    try:
        # Form verilerini al
        document_type = input_data.get("document_type", "")
        test_type = input_data.get("test_type", "")
        test_category = input_data.get("test_category", "")
        model_name = input_data.get("model", "")
        files = input_data.get("files", [])
        scoring_elements = input_data.get("scoringElements", {})
        instruction_elements = input_data.get("instructionElements", {})

        if not files:
            raise ValueError("No files provided")
            
        if not all([test_type, test_category, model_name]):
            raise ValueError("Missing required configuration")

        # Dosya içeriğini oku
        file_content = ""
        for file_path in files:
            with open(file_path, "r") as f:
                file_content += f.read() + "\n"

        # Prompt oluştur
        prompt_data = {
            "test_type": test_type,
            "test_category": test_category,
            "scoringElements": scoring_elements,
            "instructionElements": instruction_elements
        }
        prompt_response = await generate_prompt(prompt_data)
        if "error" in prompt_response:
            raise ValueError(prompt_response["error"])
        full_prompt = prompt_response["prompt"] + f"\nInput Content:\n{file_content}"

        # LLM modelini al ve çalıştır
        #burası değiştirilecek
        llm = get_llm_instance(model_name=model_name, temperature=0.7)
        response = llm.invoke(full_prompt)

        # Yanıtı doğrula
        schema = {
            "type": "object",
            "properties": {
                "scenarios": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "title": {"type": "string"},
                            "description": {"type": "string"},
                            "prerequisites": {"type": "array", "items": {"type": "string"}},
                            "steps": {"type": "array", "items": {"type": "string"}}
                        },
                        "required": ["id", "title", "description", "prerequisites", "steps"]
                    }
                }
            },
            "required": ["scenarios"]
        }

        is_valid, validation_msg = validate_output_format(response, schema)
        if not is_valid:
            raise ValueError(f"Invalid output format: {validation_msg}")

        return {
            "step": "testScenarioGeneration",
            "result": response,
            "metadata": {
                "test_category": test_category,
                "test_type": test_type,
                "model": model_name,
                "scoring_elements": scoring_elements,
                "instruction_elements": instruction_elements
            }
        }

    except Exception as e:
        logger.error(f"Test senaryo üretimi hatası: {str(e)}")
        return {"step": "testScenarioGeneration", "error": str(e)}
