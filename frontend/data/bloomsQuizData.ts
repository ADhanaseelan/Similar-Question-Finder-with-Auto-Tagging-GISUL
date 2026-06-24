export const bloomsQuizData = {
  availableTopics: [
    { id: "aiml", name: "Artificial Intelligence & Machine Learning", icon: "Brain", count: 42 },
    { id: "react", name: "React & Next.js", icon: "Code", count: 28 },
    { id: "dbms", name: "Database Systems", icon: "Database", count: 15 }
  ],
  taxonomyLevels: [
    { level: 1, name: "Remember", color: "bg-blue-500", description: "Recall facts and basic concepts" },
    { level: 2, name: "Understand", color: "bg-teal-500", description: "Explain ideas or concepts" },
    { level: 3, name: "Apply", color: "bg-green-500", description: "Use information in new situations" },
    { level: 4, name: "Analyze", color: "bg-yellow-500", description: "Draw connections among ideas" },
    { level: 5, name: "Evaluate", color: "bg-orange-500", description: "Justify a stand or decision" },
    { level: 6, name: "Create", color: "bg-pink-500", description: "Produce new or original work" }
  ],
  sampleQuiz: [
    {
      level: 1,
      levelName: "Remember",
      question: "What is Artificial Intelligence?",
      hints: ["Think about machines mimicking human cognition.", "Definition-based."]
    },
    {
      level: 2,
      levelName: "Understand",
      question: "Explain the difference between deep learning and traditional machine learning.",
      hints: ["Focus on feature extraction.", "How does data size affect them?"]
    },
    {
      level: 3,
      levelName: "Apply",
      question: "How would you train a Neural Network to classify images of cats and dogs?",
      hints: ["What architecture would you use?", "CNNs?"]
    },
    {
      level: 4,
      levelName: "Analyze",
      question: "Why might a Random Forest classifier perform better than a Decision Tree on this dataset?",
      hints: ["Think about overfitting.", "Ensemble methods."]
    },
    {
      level: 5,
      levelName: "Evaluate",
      question: "Critique the use of accuracy as the sole metric for an imbalanced dataset.",
      hints: ["What if 99% of data is class A?", "Precision, Recall, F1."]
    },
    {
      level: 6,
      levelName: "Create",
      question: "Design a novel neural network architecture to solve a real-time video processing problem.",
      hints: ["Combine spatial and temporal models.", "3D CNNs or RNNs."]
    }
  ]
};
