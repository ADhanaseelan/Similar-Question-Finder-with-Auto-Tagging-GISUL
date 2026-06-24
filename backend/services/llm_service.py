from transformers import T5Tokenizer, T5ForConditionalGeneration

class LLMService:
    def __init__(self):
        # We use a very tiny FLAN-T5 model that runs well on CPU.
        self.tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-small", legacy=False)
        self.model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-small")
        print("[LLMService] Offline model 'flan-t5-small' loaded successfully.")

    def generate_suggestions(self, question: str) -> list[str]:
        """
        Generates 2-3 follow-up questions or similar questions based on the input question.
        """
        prompt = f"Generate a highly related follow-up study question for this question: {question}"
        
        try:
            input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids
            outputs = self.model.generate(
                input_ids,
                max_new_tokens=30,
                num_return_sequences=2,
                do_sample=True,
                top_k=50,
                temperature=0.7
            )
            
            suggestions = set()
            for output in outputs:
                text = self.tokenizer.decode(output, skip_special_tokens=True).strip()
                if text and text.endswith("?"):
                    suggestions.add(text)
                elif text:
                    suggestions.add(text + "?")
                    
            return list(suggestions)
        except Exception as e:
            print(f"[LLMService] Error generating suggestions: {e}")
            return []

    def generate_answer(self, question: str) -> str:
        """
        Generates a direct answer to the user's question using the offline model.
        """
        prompt = f"Answer the following question in detail: {question}"
        
        try:
            input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids
            outputs = self.model.generate(
                input_ids,
                max_new_tokens=150,
                num_return_sequences=1,
                do_sample=True,
                top_k=50,
                temperature=0.7
            )
            
            answer = self.tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
            if not answer:
                return "I'm sorry, I couldn't think of an answer to that."
            return answer
        except Exception as e:
            print(f"[LLMService] Error generating answer: {e}")
            return "I'm having trouble thinking of an answer right now."

llm_service_instance = LLMService()

def get_llm_service():
    return llm_service_instance
