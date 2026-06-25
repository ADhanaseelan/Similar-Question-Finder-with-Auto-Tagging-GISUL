import urllib.request
import urllib.error
import json
import os
import time

class EmbeddingService:
    def __init__(self):
        # We can optionally read an API token from environment variables
        self.hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_API_KEY")
        self.model_id = "sentence-transformers/all-MiniLM-L6-v2"
        self.api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{self.model_id}"
        print(f"[EmbeddingService] Configured for API: {self.api_url}")

    def _call_api(self, inputs, retries=3) -> list:
        headers = {
            "Content-Type": "application/json"
        }
        if self.hf_token:
            headers["Authorization"] = f"Bearer {self.hf_token}"

        payload = {
            "inputs": inputs,
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
                    return res_data
            except urllib.error.HTTPError as e:
                # If model is loading (503), wait and retry
                if e.code == 503 and attempt < retries - 1:
                    print(f"[EmbeddingService] Model is loading, retrying in 3 seconds... (Attempt {attempt + 1}/{retries})")
                    time.sleep(3)
                    continue
                print(f"[EmbeddingService] API HTTPError: {e.code} - {e.reason}")
                raise e
            except Exception as e:
                if attempt < retries - 1:
                    time.sleep(1)
                    continue
                print(f"[EmbeddingService] Exception: {e}")
                raise e
        return []

    def encode(self, text: str) -> list[float]:
        if not text or not text.strip():
            return []
        try:
            res = self._call_api(text)
            # Sometimes API returns a list of floats (single text) or list of list of floats
            if res and isinstance(res, list):
                if len(res) > 0 and isinstance(res[0], list):
                    return res[0]
                return res
        except Exception as e:
            print(f"[EmbeddingService] Failed to encode text '{text}': {e}")
        # Return empty list if API fails
        return []

    def encode_batch(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        try:
            res = self._call_api(texts)
            if res and isinstance(res, list):
                # Ensure it's a list of lists
                if len(res) > 0 and not isinstance(res[0], list):
                    return [res]
                return res
        except Exception as e:
            print(f"[EmbeddingService] Failed to encode batch: {e}")
        return [[] for _ in texts]
