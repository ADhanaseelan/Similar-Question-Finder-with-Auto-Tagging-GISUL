from sentence_transformers import SentenceTransformer
import numpy as np

class EmbeddingService:
    MODEL_NAME = 'all-MiniLM-L6-v2'

    def __init__(self):
        self._model = SentenceTransformer(self.MODEL_NAME)
        print(f'[EmbeddingService] Model loaded: {self.MODEL_NAME}')

    def encode(self, text: str) -> np.ndarray:
        embedding = self._model.encode(
            text,
            convert_to_numpy=True,
            normalize_embeddings=True,
        )
        return embedding

    def encode_batch(self, texts: list[str]) -> np.ndarray:
        return self._model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,
            batch_size=32,
            show_progress_bar=False,
        )
