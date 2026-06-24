from transformers import pipeline

class LLMService:
    def __init__(self):
        # We use a very tiny FLAN-T5 model that runs well on CPU.
        # It's an instruction-following model capable of basic reasoning.
        self.generator = pipeline("text2text-generation", model="google/flan-t5-small")
        print("[LLMService] Offline model 'flan-t5-small' loaded successfully.")

    def generate_suggestions(self, question: str) -> list[str]:
        """
        Generates 2-3 follow-up questions or similar questions based on the input question.
        """
        prompt = f"Generate a highly related follow-up study question for this question: {question}"
        
        try:
            # Optimize for speed on CPU: no beam search, greedy or fast sampling
            results = self.generator(
                prompt,
                max_new_tokens=30,
                num_return_sequences=2, # Reduce to 2 for faster generation
                do_sample=True,         # Fast sampling instead of slow beams
                top_k=50,
                temperature=0.7
            )
            
            suggestions = set()
            for res in results:
                text = res['generated_text'].strip()
                # Basic cleanup
                if text and text.endswith("?"):
                    suggestions.add(text)
                elif text:
                    suggestions.add(text + "?")
                    
            return list(suggestions)
        except Exception as e:
            print(f"[LLMService] Error generating suggestions: {e}")
            return []

llm_service_instance = LLMService()

def get_llm_service():
    return llm_service_instance
