import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import Step3Preferences from './Step3Preferences';
// import Step1Dietary from './Step1Dietary';
// import Step2Swipe from './Step2Swipe';

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // The Master State
  const [userData, setUserData] = useState({
    dietary: [],
    liked_regions: [],
    budget: 2, 
    vibe: {
      spiciness: 3,
      price: 3,
      formality: 3,
      noise: 3,
      healthiness: 3
    }
  });

  
  const updateUserData = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const requestClose = () => setShowConfirmClose(true);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    
    try {
      // 1. Grab the JWT token from storage (we will set this up during the Login flow)
      const token = localStorage.getItem('token'); 

      // 2. Shoot the data to backend route
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/users/me/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // If there's no token yet during testing, this just sends 'Bearer null'
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          dietary: userData.dietary,
          liked_regions: userData.liked_regions,
          budget: userData.budget,
          vibeTarget: userData.vibe // Mapping frontend 'vibe' state to backend 'vibeTarget' schema
        })
      });

      if (!response.ok) {
        throw new Error('Backend rejected the save request');
      }

      const updatedUser = await response.json();
      console.log("Successfully saved to MongoDB:", updatedUser);
      
      setIsSaving(false);
      onClose(); // Successfully saved, dismiss the modal!

    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Is your backend server running on port 5000?");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[85vh] md:h-[70vh] rounded-3xl shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex gap-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className={`h-2 w-12 rounded-full transition-colors ${step >= num ? 'bg-green-500' : 'bg-gray-200'}`} />
            ))}
          </div>
          <button onClick={requestClose} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {!showConfirmClose && (
            <div className="h-full">
              {step === 1 && <h2 className="text-2xl text-gray-400 font-bold text-center mt-20">Step 1: Dietary (To be built)</h2>}
              {step === 2 && <h2 className="text-2xl text-gray-400 font-bold text-center mt-20">Step 2: Swipe Cards (To be connected)</h2>}
              
              {/* THE NEW COMPONENT WITH PROPS PASSED IN */}
              {step === 3 && (
                <Step3Preferences 
                  userData={userData} 
                  updateUserData={updateUserData} 
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!showConfirmClose && (
          <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            <button onClick={handleBack} disabled={step === 1 || isSaving} className={`px-6 py-3 font-bold rounded-full ${step === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}>
              Back
            </button>
            <button onClick={step === 3 ? handleSavePreferences : handleNext} disabled={isSaving} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition disabled:bg-gray-400">
              {isSaving ? 'Saving...' : (step === 3 ? 'Finish & Save' : 'Continue')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}