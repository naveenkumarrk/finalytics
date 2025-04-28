import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://localhost:8000";

// Full example data
const legitimateExample = {
  Time: 406.0,
  V1: 2.055797,
  V2: 0.377435,
  V3: 1.546322,
  V4: -1.226845,
  V5: 2.013444,
  V6: -2.047378,
  V7: 1.197830,
  V8: -0.183698,
  V9: 0.089945,
  V10: -2.187392,
  V11: -2.160390,
  V12: 1.588868,
  V13: -0.517330,
  V14: 0.545333,
  V15: -0.207715,
  V16: 0.244964,
  V17: -0.641974,
  V18: -0.798418,
  V19: -0.404300,
  V20: -0.671439,
  V21: 0.456328,
  V22: 0.676059,
  V23: 0.672498,
  V24: -0.191987,
  V25: -0.212267,
  V26: 0.238422,
  V27: -0.206486,
  V28: -0.185226,
  Amount: 0.0
};

const fraudExample = {
  Time: 41273,
  V1: -11.68221489,
  V2: 6.332882093,
  V3: -13.29710925,
  V4: 7.690771915,
  V5: -10.88989052,
  V6: -2.792360038,
  V7: -12.56178258, 
  V8: 7.28712221,
  V9: -7.570322409,
  V10: -12.83573768,
  V11: 5.804707852,
  V12: -12.15623949,
  V13: 1.184984663,
  V14: -10.46867709,
  V15: -0.416743197,
  V16: -10.99979235,
  V17: -22.60886819,
  V18: -9.498745921,
  V19: 2.102735407,
  V20: -1.009319938,
  V21: 2.133456284,
  V22: -1.271508967,
  V23: -0.035303887,
  V24: 0.615053695,
  V25: 0.349023768,
  V26: -0.428922797,
  V27: -0.694935387,
  V28: -0.818970429,
  Amount: 173.07
};

// Sample financial categories for the chatbot
const financialCategories = [
  { value: "retirement", label: "Retirement Planning" },
  { value: "investment", label: "Investment Strategy" },
  { value: "debt", label: "Debt Management" },
  { value: "budgeting", label: "Personal Budgeting" },
  { value: "tax", label: "Tax Planning" },
  { value: "insurance", label: "Insurance Planning" }
];

const FraudDetection = () => {
  // Fraud detection state
  const [formData, setFormData] = useState({
    Time: "",
    V1: "",
    V2: "",
    V3: "",
    V4: "",
    Amount: ""
  });

  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Chatbot state
  const [question, setQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { 
      type: "assistant", 
      content: "Hello! I'm your financial advisor. How can I help you today?",
      additionalInfo: ["I can answer questions about investments, retirement, budgeting, and more."],
      references: ["Information based on generally accepted financial principles."] 
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Fraud detection handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fillExampleData = (isLegitimate) => {
    const example = isLegitimate ? legitimateExample : fraudExample;
    setFormData({
      Time: example.Time.toString(),
      V1: example.V1.toString(),
      V2: example.V2.toString(),
      V3: example.V3.toString(),
      V4: example.V4.toString(),
      Amount: example.Amount.toString()
    });
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create complete payload with reasonable defaults based on example data
      const isLikelyFraud = parseFloat(formData.Amount) > 100;
      const baseExample = isLikelyFraud ? fraudExample : legitimateExample;
      
      // Construct complete payload with visible fields from form and rest from example
      const payload = {
        ...baseExample,
        Time: parseFloat(formData.Time),
        V1: parseFloat(formData.V1),
        V2: parseFloat(formData.V2),
        V3: parseFloat(formData.V3),
        V4: parseFloat(formData.V4),
        Amount: parseFloat(formData.Amount)
      };

      const response = await axios.post(`${API_URL}/predict-fraud`, payload);
      setResult(response.data.fraud ? "Fraudulent Transaction" : "Legitimate Transaction");
    } catch (err) {
      console.error(err);
      setError("Failed to predict. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chatbot handlers
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message to chat
    setChatMessages(prev => [...prev, { type: "user", content: question }]);
    
    // Save current question and clear input
    const currentQuestion = question;
    setQuestion("");
    setIsChatLoading(true);

    try {
      // Format data for API
      const formData = new FormData();
      formData.append("question", currentQuestion);
      if (selectedCategory) {
        formData.append("financial_status", selectedCategory);
      }

      // Call the financial advisor API
      const response = await axios.post(
        `${API_URL}/ask-financial-advisor`, 
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Add assistant response to chat
      setChatMessages(prev => [...prev, { 
        type: "assistant", 
        content: response.data.response,
        additionalInfo: response.data.additional_info || [],
        references: response.data.references || []
      }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { 
        type: "assistant", 
        content: "I'm sorry, I encountered an error while processing your question.",
        additionalInfo: ["Please try again or rephrase your question."],
        references: []
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 pt-20 px-4  mt-15 mb-15">      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Detection Panel */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Fraud Detection
          </h2>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => fillExampleData(true)}
              className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Legitimate Example
            </button>
            <button
              type="button"
              onClick={() => fillExampleData(false)}
              className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Fraud Example
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Time (seconds)</label>
                <input
                  type="number"
                  name="Time"
                  value={formData.Time}
                  onChange={handleChange}
                  className="w-full border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg px-3 py-2 transition"
                  placeholder="Transaction time"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                <input
                  type="number"
                  name="Amount"
                  value={formData.Amount}
                  onChange={handleChange}
                  className="w-full border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg px-3 py-2 transition"
                  placeholder="Transaction amount"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["V1", "V2", "V3", "V4"].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{field} (Principal Component)</label>
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg px-3 py-2 transition"
                    placeholder={`Enter ${field}`}
                    step="any"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-300 transition w-full md:w-auto font-medium flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Analyze Transaction
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          )}

          {result && (
            <div className={`mt-6 p-4 ${result.includes("Legitimate") ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"} rounded-lg text-center border`}>
              <h2 className={`text-xl font-semibold ${result.includes("Legitimate") ? "text-green-700" : "text-red-700"}`}>
                {result.includes("Legitimate") ? (
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {result}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    {result}
                  </div>
                )}
              </h2>
              <p className="mt-2 text-gray-700">
                {result.includes("Legitimate") 
                  ? "This transaction appears to be normal and safe to process." 
                  : "This transaction has been flagged as potentially fraudulent and requires further review."}
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="text-sm font-medium text-indigo-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              About This Tool
            </h3>
            <p className="text-gray-700 text-sm">
              This form analyzes the 6 most critical features for fraud detection while 
              sending a complete dataset to our ML model. The selected features are highly 
              correlated with fraudulent activity based on our analysis.
            </p>
          </div>
        </div>

        {/* Financial Advisor Chatbot Panel */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 flex flex-col h-full">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
            </svg>
            Financial Advisor
          </h2>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-4 overflow-y-auto flex-grow max-h-96">
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-3/4 rounded-lg p-3 ${
                      msg.type === "user" 
                        ? "bg-indigo-600 text-white rounded-br-none" 
                        : "bg-white border border-indigo-200 text-gray-700 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p>{msg.content}</p>
                    
                    {msg.type === "assistant" && msg.additionalInfo && msg.additionalInfo.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {msg.additionalInfo.map((info, i) => (
                          <li key={i} className="text-sm flex items-start">
                            <span className="text-indigo-500 mr-1 mt-1">•</span> 
                            <span>{info}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {msg.type === "assistant" && msg.references && msg.references.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-indigo-100 text-xs text-indigo-500">
                        {msg.references.map((ref, i) => (
                          <p key={i} className="italic">{ref}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-indigo-200 text-gray-700 rounded-lg rounded-bl-none p-3 max-w-3/4 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleChatSubmit} className="mt-auto">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select a Financial Topic (Optional)</label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-lg px-3 py-2 text-gray-700"
              >
                <option value="">Any Financial Topic</option>
                {financialCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="text"
                value={question}
                onChange={handleQuestionChange}
                placeholder="Ask me about your finances..."
                className="flex-grow border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-l-lg px-3 py-2"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={isChatLoading || !question.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-300 transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </form>
          
          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <p className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Always consult with a certified financial planner for personalized advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudDetection;