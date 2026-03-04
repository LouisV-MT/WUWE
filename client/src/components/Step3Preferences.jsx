import React from 'react';

export default function Step3Preferences({ userData, updateUserData }) {
  
  // Helper to handle the vibe sliders
  const handleVibeChange = (vibeKey, newValue) => {
    updateUserData('vibe', {
      ...userData.vibe,
      [vibeKey]: parseInt(newValue)
    });
  };

  const vibeSliders = [
    { key: 'spiciness', label: 'Spiciness', left: 'Mild', right: 'Fire' },
    { key: 'price', label: 'Price Vibe', left: 'Cheap Eats', right: 'Fine Dining' },
    { key: 'formality', label: 'Formality', left: 'Casual', right: 'Dress Up' },
    { key: 'noise', label: 'Noise Level', left: 'Quiet', right: 'Loud & Lively' },
    { key: 'healthiness', label: 'Healthiness', left: 'Indulgent', right: 'Clean Eats' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
      
      {/* LEFT COLUMN: BUDGET */}
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your budget?</h2>
        <p className="text-gray-500 mb-8">Set your standard price range for a meal out.</p>
        
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((level) => {
            const isSelected = userData.budget === level;
            return (
              <button
                key={level}
                onClick={() => updateUserData('budget', level)}
                className={`p-6 rounded-2xl text-2xl font-bold transition-all border-2 
                  ${isSelected 
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-md scale-105' 
                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {/* Renders $, $$, $$$, or $$$$ */}
                {Array(level).fill('$').join('')}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: VIBE SLIDERS */}
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Set the Vibe</h2>
        <p className="text-gray-500 mb-8">Tune your perfect restaurant atmosphere.</p>
        
        <div className="space-y-6">
          {vibeSliders.map((slider) => (
            <div key={slider.key} className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span>{slider.left}</span>
                <span className="text-green-600 uppercase tracking-wider text-xs">{slider.label}</span>
                <span>{slider.right}</span>
              </div>
              
              <input
                type="range"
                min="1"
                max="5"
                value={userData.vibe[slider.key]}
                onChange={(e) => handleVibeChange(slider.key, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}