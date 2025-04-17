  import { useState } from "react";
  import axios from "axios";
  import Navbar from './NavBar';
  const API_URL = import.meta.env.VITE_API_URL;

  const LoanEligibility = () => {
    const [formData, setFormData] = useState({
      Gender: "",
      Married: "",
      Dependents: "",
      Education: "",
      Self_Employed: "",
      ApplicantIncome: "",
      CoapplicantIncome: "",
      LoanAmount: "",
      Loan_Amount_Term: "",
      Credit_History: "",
      Property_Area: ""
    });
    const [result, setResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fillExampleData = (example) => {
      if (example === "good") {
        setFormData({
          Gender: "1",
          Married: "1",
          Dependents: "1",
          Education: "1",
          Self_Employed: "0",
          ApplicantIncome: "5000",
          CoapplicantIncome: "1500",
          LoanAmount: "120",
          Loan_Amount_Term: "360",
          Credit_History: "1",
          Property_Area: "1"
        });
      } else if (example === "average") {
        setFormData({
          Gender: "0",
          Married: "1",
          Dependents: "2",
          Education: "1",
          Self_Employed: "0",
          ApplicantIncome: "3000",
          CoapplicantIncome: "0",
          LoanAmount: "100",
          Loan_Amount_Term: "240",
          Credit_History: "1",
          Property_Area: "0"
        });
      } else if (example === "poor") {
        setFormData({
          Gender: "1",
          Married: "0",
          Dependents: "3",
          Education: "0",
          Self_Employed: "1",
          ApplicantIncome: "1500",
          CoapplicantIncome: "0",
          LoanAmount: "170",
          Loan_Amount_Term: "180",
          Credit_History: "0",
          Property_Area: "2"
        });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);
      
      try {
        const response = await axios.post(`${API_URL}/predict`, {
          Gender: parseFloat(formData.Gender),
          Married: parseFloat(formData.Married),
          Dependents: parseFloat(formData.Dependents),
          Education: parseFloat(formData.Education),
          Self_Employed: parseFloat(formData.Self_Employed),
          ApplicantIncome: parseFloat(formData.ApplicantIncome),
          CoapplicantIncome: parseFloat(formData.CoapplicantIncome),
          LoanAmount: parseFloat(formData.LoanAmount),
          Loan_Amount_Term: parseFloat(formData.Loan_Amount_Term),
          Credit_History: parseFloat(formData.Credit_History),
          Property_Area: parseFloat(formData.Property_Area)
        });
        setResult(response.data["Loan Status"]);
      } catch (error) {
        console.error("Error predicting loan status:", error);
        setError("Failed to process your application. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    // Group form fields for better layout
    const formGroups = [
      {
        title: "Personal Information",
        fields: ["Gender", "Married", "Dependents", "Education", "Self_Employed"]
      },
      {
        title: "Financial Details",
        fields: ["ApplicantIncome", "CoapplicantIncome", "LoanAmount", "Loan_Amount_Term", "Credit_History"]
      },
      {
        title: "Property Information",
        fields: ["Property_Area"]
      }
    ];

    // Get appropriate label for field
    const getLabel = (key) => {
      const labels = {
        "Loan_Amount_Term": "Loan Term (months)",
        "ApplicantIncome": "Applicant Income",
        "CoapplicantIncome": "Co-applicant Income",
        "LoanAmount": "Loan Amount (thousands)",
        "Credit_History": "Good Credit History",
        "Self_Employed": "Self Employed"
      };
      return labels[key] || key.replace("_", " ");
    };

    // Get example/hint for each field
    const getHint = (key) => {
      const hints = {
        "ApplicantIncome": "e.g., 5000",
        "CoapplicantIncome": "e.g., 1500 (0 if none)",
        "LoanAmount": "e.g., 120 (in thousands)",
        "Loan_Amount_Term": "e.g., 360 (30 years)",
      };
      return hints[key] || "";
    };

    const ResultSection = () => {
      if (!result && !isSubmitting) {
        return (
          <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            <p className="text-gray-600 mb-6">
              Our system evaluates various factors such as your income, loan amount, credit history, and property area.
              If you have a stable income, a good credit history, and reasonable loan terms, your loan is more likely to be approved!
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-md border border-green-200">
                <h4 className="font-medium text-green-800">Likely Approval Factors:</h4>
                <ul className="mt-2 text-green-700 text-sm pl-5 list-disc">
                  <li>Stable income (above 4000)</li>
                  <li>Good credit history</li>
                  <li>Reasonable loan amount relative to income</li>
                  <li>Longer loan terms (e.g., 20-30 years)</li>
                  <li>Semi-urban or urban property location</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 rounded-md border border-red-200">
                <h4 className="font-medium text-red-800">Likely Rejection Factors:</h4>
                <ul className="mt-2 text-red-700 text-sm pl-5 list-disc">
                  <li>Poor credit history</li>
                  <li>High loan amount relative to income</li>
                  <li>Short loan term with high monthly payments</li>
                  <li>Unstable employment (self-employed with low income)</li>
                  <li>Many dependents with insufficient income</li>
                </ul>
              </div>
            </div>
          </div>
        );
      }
      
      if (isSubmitting) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-lg font-medium text-gray-700">Processing your application...</p>
              <p className="text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        );
      }
      
      return (
        <div className={`p-6 rounded-lg border h-full ${result === "Approved" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <h3 className="text-xl font-bold mb-4">
            {result === "Approved" ? (
              <span className="text-green-600">Congratulations! Your loan is approved.</span>
            ) : (
              <span className="text-red-600">We're sorry, your loan application was not approved.</span>
            )}
          </h3>
          
          <p className={`mb-6 ${result === "Approved" ? "text-green-700" : "text-red-700"}`}>
            {result === "Approved" 
              ? "Based on the information provided, you are eligible for this loan. Our representative will contact you shortly."
              : "Based on the information provided, you are not eligible for this loan at this time. Please review your financial information or contact our support team for assistance."}
          </p>
          
          <div className="bg-white bg-opacity-60 rounded-md p-4 mb-4">
            <h4 className="font-semibold mb-2">Application Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p><span className="font-medium">Income:</span> {Number(formData.ApplicantIncome).toLocaleString()}</p>
                <p><span className="font-medium">Co-applicant:</span> {Number(formData.CoapplicantIncome).toLocaleString()}</p>
                <p><span className="font-medium">Loan Amount:</span> {Number(formData.LoanAmount).toLocaleString()}k</p>
              </div>
              <div>
                <p><span className="font-medium">Term:</span> {formData.Loan_Amount_Term} months</p>
                <p><span className="font-medium">Credit History:</span> {formData.Credit_History === "1" ? "Good" : "Poor"}</p>
                <p><span className="font-medium">Dependents:</span> {formData.Dependents}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {result === "Approved" ? (
              <div>
                <h4 className="font-semibold mb-2">Next Steps</h4>
                <ol className="list-decimal pl-5 text-green-800">
                  <li>Our loan officer will contact you within 24 hours</li>
                  <li>Prepare necessary documentation for verification</li>
                  <li>Complete the signing process</li>
                  <li>Receive funds within 3-5 business days</li>
                </ol>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold mb-2">Improvement Tips</h4>
                <ul className="list-disc pl-5 text-red-800">
                  <li>Improve your credit score before reapplying</li>
                  <li>Consider a co-signer with good credit history</li>
                  <li>Decrease your requested loan amount</li>
                  <li>Extend your loan term to reduce monthly payments</li>
                  <li>Contact our advisors for personalized assistance</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <>
      <div className="pt-5 px-2 sm:p-10 mt-20">
      {/* <Navbar/> */}
      <div className="container mx-auto my-8 px-2">
        {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white rounded-4xl">
          <h1 className="text-2xl font-bold">Loan Eligibility Calculator</h1>
          <p className="mt-2 opacity-80">Check if you qualify for a loan based on your profile</p>
        </div> */}
        
        <div className="bg-gray-100 rounded-4xl mt-4 p-4 lg:flex items-stretch lg:divide-x divide-gray-300">
          {/* Form Column */}
          <div className="lg:w-1/2 lg:pr-4 mb-6 lg:mb-0">
            <div className="bg-white p-6 rounded-4xl shadow-md">
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                <button 
                  type="button" 
                  onClick={() => fillExampleData("good")}
                  className="px-3 py-2 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                >
                  Good Example
                </button>
                <button 
                  type="button" 
                  onClick={() => fillExampleData("average")}
                  className="px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                >
                  Average Example
                </button>
                <button 
                  type="button" 
                  onClick={() => fillExampleData("poor")}
                  className="px-3 py-2 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                >
                  Poor Example
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {formGroups.map((group) => (
                  <div key={group.title} className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4">{group.title}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {group.fields.map((key) => (
                        <div key={key} className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {getLabel(key)}
                          </label>
                          {key === "Gender" ? (
                            <select
                              name={key}
                              value={formData[key]}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="1">Male</option>
                              <option value="0">Female</option>
                            </select>
                          ) : key === "Married" || key === "Education" || key === "Self_Employed" ? (
                            <select
                              name={key}
                              value={formData[key]}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="">Select {key}</option>
                              <option value="1">Yes</option>
                              <option value="0">No</option>
                            </select>
                          ) : key === "Credit_History" ? (
                            <select
                              name={key}
                              value={formData[key]}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="">Select Credit History</option>
                              <option value="1">Good</option>
                              <option value="0">Poor/None</option>
                            </select>
                          ) : key === "Dependents" ? (
                            <select
                              name={key}
                              value={formData[key]}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="">Select Dependents</option>
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3+</option>
                            </select>
                          ) : key === "Property_Area" ? (
                            <select
                              name={key}
                              value={formData[key]}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="">Select Property Area</option>
                              <option value="0">Urban</option>
                              <option value="1">Semiurban</option>
                              <option value="2">Rural</option>
                            </select>
                          ) : (
                            <div>
                              <input
                                type="number"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                placeholder={getHint(key) || `Enter ${getLabel(key)}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                              {getHint(key) && (
                                <p className="text-xs text-gray-500 mt-1">{getHint(key)}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-md font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {isSubmitting ? "Processing..." : "Check Eligibility"}
                </button>
              </form>
            </div>
          </div>
          
          {/* Results Column */}
          <div className="lg:w-1/2 lg:pl-4">
            <ResultSection />
          </div>
        </div>
      </div>
      </div>
      </>
    );
  };

  export default LoanEligibility;