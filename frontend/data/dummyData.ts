export const dashboardData = {
  user: {
    name: "Dhanaseelan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dhanaseelan"
  },
  stats: [
    {
      title: "Total Questions",
      value: "128",
      subtitle: "↑ 18 this week",
      iconType: "message",
      color: "bg-blue-100",
      subtitleColor: "text-green-500",
      iconColor: "text-blue-500"
    },
    {
      title: "Topics Explored",
      value: "8",
      subtitle: "↑ 2 new this week",
      iconType: "book",
      color: "bg-green-100",
      subtitleColor: "text-green-500",
      iconColor: "text-green-500"
    },
    {
      title: "Saved Questions",
      value: "14",
      subtitle: "View your bookmarks",
      iconType: "bookmark",
      color: "bg-pink-100",
      subtitleColor: "text-gray-500",
      iconColor: "text-pink-500"
    },
    {
      title: "Questions This Week",
      value: "27",
      subtitle: "Keep it up! 🔥",
      iconType: "trending",
      color: "bg-orange-100",
      subtitleColor: "text-gray-500",
      iconColor: "text-orange-500"
    }
  ],
  recentQuestions: [
    {
      id: 1,
      question: "Why does photosynthesis need light?",
      topic: "Biology",
      time: "2 hours ago",
      match: "92%",
      iconType: "leaf",
      iconBg: "bg-green-100",
      matchColor: "text-green-500"
    },
    {
      id: 2,
      question: "What is Newton's second law?",
      topic: "Physics",
      time: "Yesterday",
      match: "88%",
      iconType: "atom",
      iconBg: "bg-orange-100",
      matchColor: "text-orange-500"
    },
    {
      id: 3,
      question: "How does differentiation work?",
      topic: "Math",
      time: "2 days ago",
      match: "85%",
      iconType: "calculator",
      iconBg: "bg-purple-100",
      matchColor: "text-purple-500"
    },
    {
      id: 4,
      question: "What is the pH scale?",
      topic: "Chemistry",
      time: "2 days ago",
      match: "80%",
      iconType: "flask",
      iconBg: "bg-blue-100",
      matchColor: "text-blue-500"
    }
  ],
  topicDistribution: {
    total: 128,
    mostExplored: "Biology",
    data: [
      { label: "Biology", value: 45, colorClass: "bg-green-500", stroke: "#22C55E", percent: 45 },
      { label: "Physics", value: 25, colorClass: "bg-orange-500", stroke: "#F97316", percent: 25 },
      { label: "Math", value: 20, colorClass: "bg-purple-500", stroke: "#A855F7", percent: 20 },
      { label: "Chemistry", value: 10, colorClass: "bg-blue-500", stroke: "#3B82F6", percent: 10 }
    ]
  },
  activityOverview: {
    peakDay: "Monday",
    points: [
      { day: "Mon", value: 40 },
      { day: "Tue", value: 20 },
      { day: "Wed", value: 33 },
      { day: "Thu", value: 30 },
      { day: "Fri", value: 46 },
      { day: "Sat", value: 33 },
      { day: "Sun", value: 43 }
    ] // The actual chart in SVG uses specific coordinates, we will map these values to Y coordinates in the component.
  },
  aiInsight: {
    message: "You ask excellent questions! 🎯 Your curiosity in Biology is above 90% of other students.",
    iconType: "bot"
  },
  recentActivityTimeline: [
    {
      id: 1,
      time: "09:30 AM",
      title: "Question Submitted",
      desc: "Why does photosynthesis need light?",
      iconType: "pencil",
      color: "bg-purple-500"
    },
    {
      id: 2,
      time: "09:31 AM",
      title: "AI Processing",
      desc: "Analyzing your question using semantic search",
      iconType: "brain",
      color: "bg-blue-400"
    },
    {
      id: 3,
      time: "09:31 AM",
      title: "Topic Detected",
      desc: "Biology",
      iconType: "check",
      color: "bg-green-400"
    },
    {
      id: 4,
      time: "09:32 AM",
      title: "Similar Questions Found",
      desc: "3 similar questions identified",
      iconType: "search",
      color: "bg-orange-400"
    }
  ]
};
