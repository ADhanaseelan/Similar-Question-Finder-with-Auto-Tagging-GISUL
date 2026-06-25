import urllib.request
import urllib.error
import json
import os
import time

class LLMService:
    def __init__(self):
        self.hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_API_KEY")
        self.model_id = "google/flan-t5-small"
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model_id}"
        print(f"[LLMService] Configured for API: {self.api_url}")

    def _call_api(self, prompt: str, retries=3) -> str:
        headers = {
            "Content-Type": "application/json"
        }
        if self.hf_token:
            headers["Authorization"] = f"Bearer {self.hf_token}"

        payload = {
            "inputs": prompt,
            "options": {"wait_for_model": True}
        }
        req = urllib.request.Request(
            self.api_url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )

        for attempt in range(retries):
            try:
                # Add a timeout of 10s
                with urllib.request.urlopen(req, timeout=10) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    if isinstance(res_data, list) and len(res_data) > 0:
                        return res_data[0].get("generated_text", "").strip()
                    return ""
            except urllib.error.HTTPError as e:
                # If model is loading, wait and retry
                if e.code == 503 and attempt < retries - 1:
                    print(f"[LLMService] Model is loading, retrying in 3 seconds... (Attempt {attempt + 1}/{retries})")
                    time.sleep(3)
                    continue
                print(f"[LLMService] API HTTPError: {e.code}")
                break
            except Exception as e:
                if attempt < retries - 1:
                    time.sleep(1)
                    continue
                print(f"[LLMService] Exception: {e}")
                break
        return ""

    def generate_suggestions(self, question: str) -> list[str]:
        prompt = f"Generate a highly related follow-up study question for this question: {question}"
        try:
            res = self._call_api(prompt)
            if res:
                suggestions = set()
                for line in res.split("\n"):
                    clean = line.strip().lstrip("-*123. ")
                    if clean:
                        if not clean.endswith("?"):
                            clean += "?"
                        suggestions.add(clean)
                return list(suggestions)[:2]
        except Exception as e:
            print(f"[LLMService] Error generating suggestions: {e}")
        return [
            f"Can you explain the main concepts behind: {question}?",
            f"What are some real-world applications of: {question}?"
        ]

    def generate_answer(self, question: str) -> str:
        prompt = f"Answer the following question in detail: {question}"
        try:
            res = self._call_api(prompt)
            if res:
                return res
        except Exception as e:
            print(f"[LLMService] Error generating answer: {e}")
        return f"This is an automated response for your question: '{question}'. For a detailed analysis, please review the related/similar questions shown below."

llm_service_instance = LLMService()

def get_llm_service():
    return llm_service_instance
