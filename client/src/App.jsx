import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Utensils } from 'lucide-react';

// Some delicious placeholder data for our prototype
const FOOD_CARDS = [
  { id: 1, name: "Kazu", cuisine: "Japanese", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Schwartz's Deli", cuisine: "Smoked Meat", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "La Banquise", cuisine: "Poutine", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Elena", cuisine: "Italian", img: "https://images.unsplash.com/photo-1604068549290-dea0e4a30536?auto=format&fit=crop&w=800&q=80" },
];

export default function App() {
  const [cards, setCards] = useState(FOOD_CARDS);
  const [likedCuisines, setLikedCuisines] = useState([]);

  // Handles the math when you let go of a dragged card
  const handleDragEnd = (event, info, card) => {
    const swipeThreshold = 100; // How far you have to drag to trigger a swipe

    if (info.offset.x > swipeThreshold) {
      handleSwipe(card, "right");
    } else if (info.offset.x < -swipeThreshold) {
      handleSwipe(card, "left");
    }
  };

  // Removes the card from the deck and saves the preference
  const handleSwipe = (card, direction) => {
    if (direction === "right") {
      setLikedCuisines((prev) => [...prev, card.cuisine]);
      console.log(`Saved ${card.cuisine} to liked_regions!`);
    }
    
    // Remove the top card
    setCards((prev) => prev.filter((c) => c.id !== card.id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden relative">
      
      {/* Header */}
      <div className="absolute top-10 text-center z-10">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Utensils className="text-green-400" /> What are you craving?
        </h1>
        <p className="text-gray-400">Swipe right to build your taste profile</p>
      </div>

      {/* The Card Stack Container */}
      <div className="relative w-full max-w-sm h-[60vh] mt-20">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isTopCard = index === cards.length - 1;
            
            return (
              <motion.div
                key={card.id}
                className="absolute w-full h-full bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden"
                style={{ zIndex: index }}
                
                // Only let the top card be dragged
                drag={isTopCard ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(e, info) => handleDragEnd(e, info, card)}
                
                // Entrance and exit animations
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ 
                  scale: isTopCard ? 1 : 0.95, 
                  opacity: 1, 
                  y: isTopCard ? 0 : 20 
                }}
                exit={{ 
                  x: likedCuisines.includes(card.cuisine) ? 500 : -500, 
                  opacity: 0, 
                  transition: { duration: 0.3 } 
                }}
                whileDrag={{ cursor: "grabbing" }}
              >
                {/* Card Image */}
                <img 
                  src={card.img} 
                  alt={card.name} 
                  className="w-full h-3/4 object-cover pointer-events-none"
                />
                
                {/* Card Text Content */}
                <div className="p-6 h-1/4 flex flex-col justify-center bg-gradient-to-t from-black to-gray-900">
                  <h2 className="text-2xl font-bold text-white">{card.name}</h2>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold w-max">
                    {card.cuisine}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* What happens when we run out of cards */}
        {cards.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Taste Profile Saved!</h2>
            <p className="text-gray-400">You loved: {likedCuisines.join(', ')}</p>
          </div>
        )}
      </div>

      {/* The Buttons (Optional, but good for accessibility if they don't want to swipe) */}
      <div className="flex gap-8 mt-10 z-10">
        <button 
          onClick={() => cards.length > 0 && handleSwipe(cards[cards.length - 1], "left")}
          className="p-4 bg-gray-800 border border-gray-700 rounded-full text-red-400 hover:bg-gray-700 hover:scale-110 transition-all shadow-lg"
        >
          <X size={32} />
        </button>
        <button 
          onClick={() => cards.length > 0 && handleSwipe(cards[cards.length - 1], "right")}
          className="p-4 bg-gray-800 border border-gray-700 rounded-full text-green-400 hover:bg-gray-700 hover:scale-110 transition-all shadow-lg"
        >
          <Heart size={32} />
        </button>
      </div>

    </div>
  );
}