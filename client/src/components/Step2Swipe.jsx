import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Utensils } from 'lucide-react';

export default function Step2Swipe({ userData, updateUserData }) {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Simulated API response with Montreal classics
        const mockApiResponse = [
          { _id: '1', name: "Kazu", cuisine: "Japanese", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80" },
          { _id: '2', name: "Schwartz's Deli", cuisine: "Smoked Meat", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80" },
          { _id: '3', name: "La Banquise", cuisine: "Poutine", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=800&q=80" },
          { _id: '4', name: "Elena", cuisine: "Italian", img: "https://images.unsplash.com/photo-1604068549290-dea0e4a30536?auto=format&fit=crop&w=800&q=80" },
        ];
        
        setCards(mockApiResponse);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Handles the visual swipe and updates the master state
  const handleSwipe = (card, direction) => {
    if (direction === "right") {
      // Check to prevent adding duplicate cuisines (e.g., swiping right on two Italian places)
      if (!userData.liked_regions.includes(card.cuisine)) {
        updateUserData('liked_regions', [...userData.liked_regions, card.cuisine]);
      }
    }
    
    // Remove the card from the local stack so the next one shows
    setCards((prev) => prev.filter((c) => c._id !== card._id));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full text-green-500 font-semibold">Loading your taste profile...</div>;
  }

  return (
    <div className="flex flex-col items-center h-full relative pt-8">
      
      {/* Header specific to the swipe step */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Utensils className="text-green-500" /> What are you craving?
        </h2>
        <p className="text-gray-500">Swipe right on what looks good.</p>
      </div>

      {/* The Swipeable Card Stack Container */}
      <div className="relative w-full max-w-sm h-[400px]">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isTopCard = index === cards.length - 1;
            
            return (
              <motion.div
                key={card._id}
                className="absolute w-full h-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                style={{ zIndex: index }}
                
                // Framer Motion Drag Settings
                drag={isTopCard ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 100) handleSwipe(card, "right");
                  else if (info.offset.x < -100) handleSwipe(card, "left");
                }}
                
                // Animations
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: isTopCard ? 1 : 0.95, opacity: 1, y: isTopCard ? 0 : 20 }}
                exit={{ x: userData.liked_regions.includes(card.cuisine) ? 500 : -500, opacity: 0 }}
                whileDrag={{ cursor: "grabbing" }}
              >
                <img src={card.img} alt={card.name} className="w-full h-3/4 object-cover pointer-events-none" />
                
                <div className="p-6 h-1/4 flex flex-col justify-center bg-white">
                  <h3 className="text-2xl font-bold text-gray-900">{card.name}</h3>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold w-max">
                    {card.cuisine}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* What shows when they finish all cards */}
        {cards.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Taste Profile Saved!</h3>
            <p className="text-gray-500 max-w-xs">
              We've added your favorite cuisines to your preferences. Click Continue below to proceed.
            </p>
          </div>
        )}
      </div>

      {/* Manual Swipe Buttons */}
      <div className="flex gap-8 mt-8">
        <button 
          onClick={() => cards.length > 0 && handleSwipe(cards[cards.length - 1], "left")} 
          className="p-4 bg-white border border-gray-200 rounded-full text-red-500 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
        >
          <X size={32} strokeWidth={3} />
        </button>
        <button 
          onClick={() => cards.length > 0 && handleSwipe(cards[cards.length - 1], "right")} 
          className="p-4 bg-white border border-gray-200 rounded-full text-green-500 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
        >
          <Heart size={32} strokeWidth={3} />
        </button>
      </div>

    </div>
  );
}