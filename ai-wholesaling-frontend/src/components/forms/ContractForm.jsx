import { useState, useEffect } from 'react';
import { X, FileText, User, Building, Search, CheckCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from 'jspdf';
import { useNotifications } from '../../ui/Notification';

// Step 1: The form for entering details
const DetailsStep = ({ formData, setFormData, onPriceChange, onSubmit, onCancel }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Parties Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2"><User className="h-5 w-5" /><span>Assignor Information</span></h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignor Name *</label>
            <input type="text" name="assignorName" required value={formData.assignorName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2"><User className="h-5 w-5" /><span>Assignee Information</span></h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignee Name *</label>
            <input type="text" name="assigneeName" required value={formData.assigneeName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Property Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4 flex items-center space-x-2"><Building className="h-5 w-5" /><span>Property & Financials</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Address *</label>
            <input type="text" name="propertyAddress" required value={formData.propertyAddress} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Legal Description</label>
            <input type="text" name="legalDescription" value={formData.legalDescription} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price *</label>
            <input type="number" name="purchasePrice" required value={formData.purchasePrice} onChange={onPriceChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Earnest Money *</label>
            <input type="number" name="earnestMoney" required value={formData.earnestMoney} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Fee (Calculated)</label>
            <p className="w-full px-3 py-2 bg-gray-100 rounded-lg">${formData.assignmentFee}</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4">Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Closing Date *</label>
            <DatePicker selected={formData.closingDate} onChange={(date) => setFormData(prev => ({ ...prev, closingDate: date }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contract Date *</label>
            <DatePicker selected={formData.contractDate} onChange={(date) => setFormData(prev => ({ ...prev, contractDate: date }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Analyze & Find Buyers</span>
        </button>
      </div>
    </form>
  );
};

// Step 2: The analysis progress screen
const AnalysisStep = () => (
  <div className="text-center py-12">
    <h3 className="text-lg font-semibold text-gray-800">AI is Analyzing Your Property...</h3>
    <p className="text-gray-600 mb-6">Finding the best buyers and investors for you.</p>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
    </div>
  </div>
);

// Step 3: The results screen
const ResultsStep = ({ onFinish, matchedInvestors, analysisMessage, generateContractPDF, handleSendEmail, formData }) => (
  <div className="text-center py-8">
    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-800">Analysis Complete!</h3>
    <p className="text-gray-600 mb-6">{analysisMessage}</p>
    <div className="bg-gray-50 rounded-lg p-4 text-left">
      <h4 className="font-semibold mb-2">Matched Investors:</h4>
      {matchedInvestors.length > 0 ? (
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {matchedInvestors.map((investor, index) => (
            <li key={index} className="flex justify-between items-center">
              {investor.name}
              <div>
                <button onClick={() => generateContractPDF(formData, investor)} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors mr-2">
                  Generate Contract
                </button>
                <button onClick={() => handleSendEmail(formData, investor)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                  Send Email
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No investors matched the criteria.</p>
      )}
    </div>
    <div className="bg-gray-50 rounded-lg p-4 text-left mt-4">
      <h4 className="font-semibold mb-2">Next Steps:</h4>
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        <li>Review matched investors in your dashboard.</li>
        <li>Initiate contact or send generated contracts.</li>
        <li>You will receive notifications as investors respond.</li>
      </ul>
    </div>
    <button onClick={onFinish} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Finish</button>
  </div>
);

import { db } from '../../services/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

export default function ContractForm({ onGenerate, onCancel }) {
  const { addNotification } = useNotifications();
  const [step, setStep] = useState('details'); // details, analyzing, results
  const [formData, setFormData] = useState({
    assignorName: '',
    assigneeName: '',
    propertyAddress: '',
    legalDescription: '',
    purchasePrice: '',
    assignmentFee: 0,
    earnestMoney: '',
    closingDate: null,
    contractDate: null,
  });
  const [matchedInvestors, setMatchedInvestors] = useState([]);
  const [analysisMessage, setAnalysisMessage] = useState('');

  const calculateAssignmentFee = (price) => {
    const calculatedFee = parseFloat(price) * 0.1;
    let fee = calculatedFee;
    if (fee < 10000) fee = 10000;
    else if (fee > 20000) fee = 20000;
    return isNaN(fee) ? 0 : fee;
  };

  const handlePriceChange = (e) => {
    const price = e.target.value;
    const fee = calculateAssignmentFee(price);
    setFormData(prev => ({ ...prev, purchasePrice: price, assignmentFee: fee }));
  };

  const matchInvestors = async (propertyDetails) => {
    const investorsRef = collection(db, "investors");
    
    const q = query(investorsRef, 
      where('minBudget', '<=', Number(propertyDetails.purchasePrice))
    );

    const querySnapshot = await getDocs(q);
  
    let investors = [];
    querySnapshot.forEach((doc) => {
      const investor = { id: doc.id, ...doc.data() };
      if (investor.maxBudget >= Number(propertyDetails.purchasePrice)) {
        const locationString = propertyDetails.propertyAddress.split(',')[1]?.trim();
        if (locationString && investor.targetAreas?.includes(locationString)) {
          investors.push(investor);
        }
      }
    });
  
    return investors;
  };

  const generateContractPDF = async (contractData, investor) => {
    const doc = new jsPDF();

    doc.text("Purchase Agreement", 20, 20);
    doc.text(`Assignor: ${contractData.assignorName}`, 20, 30);
    doc.text(`Assignee: ${investor.name}`, 20, 40);
    doc.text(`Purchase Price: ${contractData.purchasePrice}`, 20, 50);
    doc.text(`Property Address: ${contractData.propertyAddress}`, 20, 60);
    doc.text(`Earnest Money: ${contractData.earnestMoney}`, 20, 70);
    doc.text(`Closing Date: ${contractData.closingDate?.toLocaleDateString()}`, 20, 80);

    doc.save("purchase-agreement.pdf");

    try {
      await addDoc(collection(db, "contracts"), {
        ...contractData,
        assigneeName: investor.name,
        status: "Generated",
      });
      addNotification('success', 'Contract saved to Firestore!');
    } catch (error) {
      addNotification('error', 'Failed to save contract to Firestore.');
    }
  };

  const handleSendEmail = (contractData, investor) => {
    const subject = `Your Property Contract for ${contractData.propertyAddress}`;
    const body = `Hello ${investor.name},\n\nHere are the details of your contract:\n\n` +
      `Assignor: ${contractData.assignorName}\n` +
      `Assignee: ${investor.name}\n` +
      `Purchase Price: ${contractData.purchasePrice}\n` +
      `Property Address: ${contractData.propertyAddress}\n` +
      `Earnest Money: ${contractData.earnestMoney}\n` +
      `Closing Date: ${contractData.closingDate?.toLocaleDateString()}\n\n` +
      `Please review the attached contract.\n\n` +
      `Best regards,\n` +
      `The AI Wholesaling Team`;

    window.location.href = `mailto:${investor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    onGenerate(formData);
    setStep('analyzing');

    const investors = await matchInvestors(formData);
    setMatchedInvestors(investors);
    setAnalysisMessage(`We've found ${investors.length} potential buyers.`);
    
    setStep('results');
  };

  const getStepTitle = () => {
    switch (step) {
      case 'analyzing': return 'Analyzing Property';
      case 'results': return 'Analysis Complete';
      default: return 'Generate Contract';
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{getStepTitle()}</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {step === 'details' && 
        <DetailsStep 
          formData={formData} 
          setFormData={setFormData} 
          onPriceChange={handlePriceChange} 
          onSubmit={handleDetailsSubmit} 
          onCancel={onCancel} 
        />}
      {step === 'analyzing' && <AnalysisStep />}
      {step === 'results' && <ResultsStep onFinish={onCancel} matchedInvestors={matchedInvestors} analysisMessage={analysisMessage} generateContractPDF={generateContractPDF} handleSendEmail={handleSendEmail} formData={formData} />}
    </div>
  );
}
