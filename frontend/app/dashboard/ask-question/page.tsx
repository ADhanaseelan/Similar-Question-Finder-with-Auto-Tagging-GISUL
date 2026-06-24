"use client";

import { motion } from "framer-motion";
import {
  Send,
  Sparkles,
  Search,
  Brain,
  Clock,
  Zap,
  Leaf,
  CheckCircle2,
  Activity,
  PieChart,
  TrendingUp,
  Bookmark,
  Copy,
  Share2,
  RefreshCw,
  History,
  Target,
  Loader2,
  AlertCircle,
  Bot
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { askQuestionData } from "../../../data/askQuestionDummyData";

export default function AskQuestionPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  
  const { statistics, recentSearches, recommendedTopics } = askQuestionData;
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([
    "What is Artificial Intelligence and Machine Learning?",
    "Explain how the virtual DOM works in React",
    "What is the time complexity of sorting algorithms?"
  ]);
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  useEffect(() => {
    // Fetch dynamic random suggestions from the database
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await fetch("http://localhost:8000/api/questions/suggestions", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setDynamicSuggestions(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic suggestions", err);
      }
    };
    
    fetchSuggestions();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2 && showAutocomplete) {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          const res = await fetch(`http://localhost:8000/api/questions/autocomplete?q=${encodeURIComponent(query)}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setAutocompleteResults(data);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setAutocompleteResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, showAutocomplete]);

  const handleSend = async (questionText: string = query) => {
    if (!questionText.trim()) return;
    setQuery(questionText);
    setShowAutocomplete(false);
    setAutocompleteResults([]);
    setIsLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("http://localhost:8000/api/questions/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question: questionText })
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to process question. Please try again.");
      }

      const data = await res.json();
      setSearchResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const displayData = searchResult ? {
    analysis: {
      topic: searchResult.topic || (searchResult.isDuplicate ? "Duplicate Detected" : "Unknown"),
      confidence: searchResult.confidence ? Math.round(searchResult.confidence * 100) : (searchResult.isDuplicate ? 100 : 0),
      similarity: searchResult.similarQuestions?.length > 0 ? searchResult.similarQuestions[0].similarity : (searchResult.isDuplicate ? searchResult.similarity : 0),
      processingTime: "0.23 sec",
      complexity: "Intermediate"
    },
    similarQuestions: searchResult.similarQuestions || [],
    chatResponse: searchResult.chatResponse,
    isDuplicate: searchResult.isDuplicate,
    duplicateQuestion: searchResult.duplicateQuestion,
    insights: {
      primary: searchResult.topic || "N/A",
      related: [] // We can leave this empty since backend doesn't provide it yet
    }
  } : null;

  return (
    <div className="pb-12 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Ask Study Question</h1>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" /> Get AI-powered semantic search and topic detection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN COLUMN (Left/Center) */}
        <div className="lg:col-span-2 space-y-8">

          {/* SEARCH BOX */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowAutocomplete(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Search or type your question..."
                className="w-full bg-gray-50 border-none rounded-2xl p-5 pr-24 text-gray-800 focus:ring-2 focus:ring-indigo-500/50 resize-none outline-none font-medium text-lg"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading}
                className="absolute bottom-5 right-5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white p-3 rounded-xl shadow-md transition-transform hover:scale-105 flex items-center gap-2 font-semibold"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">{isLoading ? "Sending..." : "Send"}</span>
              </button>
              
              {/* AUTOCOMPLETE DROPDOWN */}
              {autocompleteResults.length > 0 && showAutocomplete && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                  {autocompleteResults.map((res, i) => (
                    <button 
                      key={i}
                      className="w-full text-left px-5 py-3 hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 font-medium text-sm transition-colors border-b border-gray-50 last:border-0 flex items-center gap-3"
                      onClick={() => {
                        setQuery(res);
                        setShowAutocomplete(false);
                        handleSend(res);
                      }}
                    >
                      <Search className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate">{res}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Suggested Questions</p>
              <div className="flex flex-wrap gap-2">
                {dynamicSuggestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="px-4 py-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 rounded-full text-sm font-medium border border-gray-100 transition-colors"
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading && !displayData && (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
              <p className="font-bold text-lg">Analyzing your question...</p>
            </div>
          )}
          {/* SIMILAR QUESTIONS FOUND */}
          {displayData && !displayData.isDuplicate && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center"></div>
              )}
              <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                <Copy className="w-5 h-5 text-indigo-500" /> Similar Questions Found
              </h3>
              {displayData.similarQuestions.length === 0 ? (
                <p className="text-gray-500 font-medium text-center py-6">No similar questions found yet. You're exploring new territory!</p>
              ) : (
                <div className="space-y-4">
                  {displayData.similarQuestions.map((sq: any, idx: number) => (
                    <div key={idx} className="group border border-gray-100 rounded-2xl p-5 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Leaf className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors mb-1">{sq.question}</h4>
                        <p className="text-xs text-gray-500 font-medium">Topic: {sq.topic}</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                          {sq.similarity}%
                        </div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Similar</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* RESULTS SECTION */}
          {displayData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

              {/* AI CHAT RESPONSE */}
              {displayData.chatResponse && (
                <div className={`bg-white rounded-3xl p-6 shadow-sm border ${displayData.isDuplicate ? 'border-orange-200 bg-orange-50/50' : 'border-indigo-100 bg-indigo-50/30'}`}>
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${displayData.isDuplicate ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {displayData.isDuplicate ? <AlertCircle className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{displayData.isDuplicate ? "Duplicate Question Detected" : "AI Assistant"}</h3>
                      <p className="text-gray-600 font-medium leading-relaxed">{displayData.chatResponse}</p>
                    </div>
                  </div>
                </div>
              )}



              {/* DUPLICATE WARNING */}
              {displayData.isDuplicate && !displayData.chatResponse && (
                <div className="bg-orange-50 rounded-3xl p-6 shadow-sm border border-orange-200 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Duplicate Question Detected</h3>
                    <p className="text-gray-600 font-medium mb-2">You already asked a very similar question recently:</p>
                    <p className="text-orange-700 font-bold p-3 bg-orange-100/50 rounded-xl border border-orange-200">"{displayData.duplicateQuestion}" ({displayData.analysis.similarity}% Match)</p>
                  </div>
                </div>
              )}

              {/* QUESTION ANALYSIS */}
              {!displayData.isDuplicate && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                  )}
                  <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-500" /> Question Analysis
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <AnalysisStat title="Detected Topic" value={displayData.analysis.topic} icon={<Target className="w-4 h-4 text-green-500" />} />

                    <div className="col-span-2 md:col-span-1 border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confidence Score</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl font-bold text-gray-800">{displayData.analysis.confidence}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${displayData.analysis.confidence}%` }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        />
                      </div>
                    </div>

                    <AnalysisStat title="Similarity Match" value={`${displayData.analysis.similarity}%`} icon={<Search className="w-4 h-4 text-blue-500" />} />
                    <AnalysisStat title="Processing Time" value={displayData.analysis.processingTime} icon={<Clock className="w-4 h-4 text-orange-500" />} />
                    <AnalysisStat title="Question Complexity" value={displayData.analysis.complexity} icon={<Zap className="w-4 h-4 text-yellow-500" />} />
                  </div>
                </div>
              )}
              {/* AI PROCESSING TIMELINE */}
              {!displayData.isDuplicate && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" /> AI Processing Timeline
                  </h3>
                  {/* <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:to-gray-100">
                    {[
                      { step: "Converting question to vector embedding" },
                      { step: "Searching indexed question database" },
                      { step: "Running semantic similarity match" },
                      { step: `Assigning topic tags (${displayData.analysis.topic})` }
                    ].map((item: any, idx: number) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-indigo-500 text-white shadow-sm absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-4 md:pl-0 md:group-even:text-right md:group-odd:text-left md:group-even:pr-4 md:group-odd:pl-4">
                          <h4 className="text-sm font-bold text-gray-800">{item.step}</h4>
                        </div>
                      </div>
                    ))}
                  </div> */}
                </div>
              )}

            </motion.div>
          )}

        </div>

        {/* SIDE COLUMN (Right) */}
        <div className="space-y-6">

          {/* TOPIC INSIGHTS */}
          <div className="bg-gradient-to-b from-[#131421] to-[#1c1d30] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-2xl"></div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
              <PieChart className="w-5 h-5 text-indigo-400" /> Topic Insights
            </h3>

            {displayData ? (
              <>
                <div className="mb-6 relative z-10">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Primary Topic</p>
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    {displayData.insights.primary}
                  </p>
                </div>

                <div className="space-y-4 relative z-10">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Related Topics</p>
                  {displayData.insights.related.length === 0 ? (
                    <p className="text-gray-400 text-sm">No related topics mapped yet.</p>
                  ) : (
                    displayData.insights.related.map((rt: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                          <span className="text-gray-200">{rt.topic}</span>
                          <span className="text-indigo-300">{rt.match}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rt.match}%` }}
                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="relative z-10 text-center py-6">
                <p className="text-gray-400 text-sm">Ask a question to see AI insights</p>
              </div>
            )}
          </div>

          {/* STUDY STATISTICS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> Study Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="text-sm font-medium text-gray-500">Questions Today</span>
                <span className="text-lg font-bold text-gray-800">{statistics.today}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="text-sm font-medium text-gray-500">Total Questions</span>
                <span className="text-lg font-bold text-gray-800">{statistics.total}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                <span className="text-sm font-medium text-gray-500">Favorite Topic</span>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{statistics.favorite}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Avg Similarity</span>
                <span className="text-lg font-bold text-green-500">{statistics.avgSimilarity}%</span>
              </div>
            </div>
          </div>

          {/* RECENT SEARCHES */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" /> Recent Searches
            </h3>
            <ul className="space-y-3">
              {recentSearches.map((search, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors group">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-indigo-500 transition-colors"></div>
                  {search}
                </li>
              ))}
            </ul>
          </div>

          {/* RECOMMENDED TOPICS */}
          {/* <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" /> Recommended
            </h3>
            <div className="flex flex-wrap gap-2">
              {recommendedTopics.map((topic, idx) => (
                <span key={idx} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${topic.color}`}>
                  {topic.label}
                </span>
              ))}
            </div>
          </div> */}

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionButton icon={<Bookmark className="w-4 h-4" />} label="Save" />
              <ActionButton icon={<Copy className="w-4 h-4" />} label="Copy" />
              <ActionButton icon={<Share2 className="w-4 h-4" />} label="Share" />
              <ActionButton icon={<RefreshCw className="w-4 h-4" />} label="Ask Another" />
              <button
                onClick={() => router.push("/dashboard/history")}
                className="col-span-2 mt-2 w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-bold border border-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <History className="w-4 h-4" /> View History
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponents
function AnalysisStat({ title, value, icon }: any) {
  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-lg font-bold text-gray-800">{value}</div>
    </div>
  );
}

function ActionButton({ icon, label }: any) {
  return (
    <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 font-semibold text-xs border border-gray-100 transition-all">
      {icon}
      {label}
    </button>
  );
}
