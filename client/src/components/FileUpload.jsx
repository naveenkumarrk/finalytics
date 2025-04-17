import { useState } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const FileUpload = ({ onAnalysisComplete }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
  
    if (!file.name.endsWith('.pdf')) {
      setError("Please upload a PDF file");
      return;
    }

    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Upload response:', response.data);
      onAnalysisComplete();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || "Failed to process file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const useSampleStatement = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/use-sample`);
      onAnalysisComplete();
    } catch (err) {
      setError("Failed to load sample statement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Begin Your Financial Journey
        </span>
        <div className="ml-2 h-px flex-grow bg-gradient-to-r from-indigo-500 to-transparent"></div>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex flex-col">
          <div 
            className={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 backdrop-blur-sm
              ${dragActive ? "border-indigo-500 bg-indigo-50/80 shadow-md" : "border-slate-300 hover:border-indigo-300 bg-white/50"}
              ${loading ? "opacity-60" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-6 rounded-full bg-indigo-50 p-3 w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <p className="mb-2 text-base font-medium text-slate-700">
                <span className="font-bold text-indigo-600">Select a file</span> or drag it here
              </p>
              <p className="text-sm text-slate-500">PDF bank statements only</p>
              
              {fileName && (
                <div className="mt-4 text-sm bg-indigo-50 text-indigo-700 py-2 px-4 rounded-full flex items-center shadow-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {fileName}
                </div>
              )}
              
              <input
                type="file"
                accept=".pdf"
                onChange={handleInputChange}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          
          <p className="mt-4 text-sm text-slate-600 px-2 italic">
            Upload your bank statement to unlock a comprehensive analysis of your financial transactions and spending patterns.
          </p>
        </div>
        
        {/* Sample Section */}
        <div className="flex flex-col">
          <div className="bg-gradient-to-b from-slate-100 to-white rounded-xl p-6 shadow-md border border-slate-200 h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.indigo.100/10%),transparent_70%)]"></div>
            <div className="flex flex-col h-full relative z-10">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  New to the platform?
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Experience our premium analysis features with our curated sample statement. Perfect for exploring the capabilities before uploading your own documents.
                </p>
              </div>
              
              <button
                onClick={useSampleStatement}
                disabled={loading}
                className="w-full px-6 py-3 text-base font-medium text-white 
                        bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-indigo-500 disabled:opacity-50 transition-all transform hover:scale-[1.02] shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing your request...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Try Sample Statement
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 shadow-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;