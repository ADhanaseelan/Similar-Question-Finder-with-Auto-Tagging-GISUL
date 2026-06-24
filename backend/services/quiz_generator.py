import asyncio
import random

class QuizGeneratorService:
    def __init__(self):
        pass

    async def generate_mock_quiz(self, source_type: str, content: str, blooms_level: str) -> list[dict]:
        """
        Mocks the generation of a quiz using an LLM. 
        In a real scenario, this would use OpenAI, Gemini, or Anthropic APIs
        with a tailored prompt asking for a specific Bloom's cognitive level.
        """
        # Simulate network / LLM processing delay (3 to 5 seconds)
        await asyncio.sleep(random.uniform(2.5, 4.0))

        # We will generate 3 realistic questions. In a real app, this would be parsed from LLM JSON output.
        level_to_use = blooms_level if blooms_level != "All Blooms Levels" else random.choice(["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"])

        # Create some generic but structured mock questions to demonstrate the UI
        questions = [
            {
                "question": f"Based on the provided {source_type}, what is the primary core concept being discussed?",
                "options": [
                    "A loosely related supporting detail.",
                    "The exact core concept mentioned in the text.",
                    "An entirely unrelated topic.",
                    "A contradictory statement to the text."
                ],
                "correctAnswer": 1,
                "explanation": "The text heavily focuses on the core concept, making it the primary subject.",
                "bloomLevel": level_to_use
            },
            {
                "question": f"If we apply the principles from the text to a new scenario, what would be the most likely outcome?",
                "options": [
                    "The system would fail immediately.",
                    "Nothing would change.",
                    "It would yield a predictable result aligning with the text.",
                    "It requires more information not present in the text."
                ],
                "correctAnswer": 2,
                "explanation": "Applying the principles predictably yields results aligned with the core text.",
                "bloomLevel": "Apply"
            },
            {
                "question": f"Which of the following best critically evaluates the argument presented in the {source_type}?",
                "options": [
                    "It lacks substantial evidence for its secondary claims.",
                    "It is completely flawless.",
                    "It is written in a confusing manner.",
                    "It does not address the topic at all."
                ],
                "correctAnswer": 0,
                "explanation": "Critical evaluation reveals that while the primary claim is strong, secondary claims lack deep evidence.",
                "bloomLevel": "Evaluate"
            }
        ]

        # If a specific level was requested, just tag them all with that level for demonstration
        if blooms_level != "All Blooms Levels":
            for q in questions:
                q["bloomLevel"] = blooms_level

        return questions
