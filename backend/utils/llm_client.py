import requests
import logging

class LLMClient:
    def __init__(self):
        self.api_url = "http://localhost:1234/v1"
        self.model_name = "llama-3.2-3b-instruct"
        self.logger = logging.getLogger("LLMClient")

    async def generate_response(self, prompt, temperature=0.2, max_tokens=4096):
        """LLM API çağrısı yapan temel metod"""
        payload = {
            "model": self.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        try:
            response = requests.post(f"{self.api_url}/chat/completions", json=payload)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except requests.RequestException as e:
            self.logger.error(f"LLM API Error: {str(e)}")
            raise
