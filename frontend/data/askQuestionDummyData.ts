export const askQuestionData = {
  suggestedQuestions: [
    "What is Artificial Intelligence and Machine Learning?",
    "Explain how the virtual DOM works in React",
    "What is the time complexity of sorting algorithms?"
  ],
  analysis: {
    topic: "Biology",
    confidence: 94,
    similarity: 92,
    processingTime: "0.42 sec",
    complexity: "Intermediate"
  },
  similarQuestions: [
    {
      id: 1,
      question: "Why do plants need sunlight?",
      similarity: 92,
      askedBy: 18,
      iconType: "leaf"
    },
    {
      id: 2,
      question: "How do plants make food?",
      similarity: 85,
      askedBy: 12,
      iconType: "leaf"
    },
    {
      id: 3,
      question: "What is chlorophyll?",
      similarity: 80,
      askedBy: 9,
      iconType: "leaf"
    }
  ],
  timeline: [
    { id: 1, step: "Question Submitted", status: "completed" },
    { id: 2, step: "Embedding Generated", status: "completed" },
    { id: 3, step: "Similarity Calculated", status: "completed" },
    { id: 4, step: "Topic Classified", status: "completed" },
    { id: 5, step: "Saved to Database", status: "completed" }
  ],
  insights: {
    primary: "Biology",
    related: [
      { topic: "Chemistry", match: 40 },
      { topic: "Environmental Science", match: 28 },
      { topic: "Botany", match: 65 }
    ]
  },
  statistics: {
    today: 6,
    total: 124,
    favorite: "Biology",
    avgSimilarity: 88
  },
  recentSearches: [
    "Why do plants need sunlight?",
    "Explain Newton's law",
    "What is DNA?",
    "What is Integration?"
  ],
  recommendedTopics: [
    { label: "Cell Structure", color: "bg-blue-100 text-blue-600" },
    { label: "Plant Nutrition", color: "bg-green-100 text-green-600" },
    { label: "Photosynthesis", color: "bg-orange-100 text-orange-600" },
    { label: "Ecosystem", color: "bg-red-100 text-red-600" }
  ]
};
